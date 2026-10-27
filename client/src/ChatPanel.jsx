import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { addChatParticipant, listMessages, postMessage } from './chatAPI.js';

function mergeMessages(current, incoming) {
  const messages = new Map(current.map(message => [message.id, message]));
  for (const message of incoming) messages.set(message.id, message);
  return [...messages.values()].sort((left, right) =>
    new Date(left.createdAt) - new Date(right.createdAt)
      || left.id.localeCompare(right.id));
}

export default function ChatPanel({ chat, token, userId, username, onUnauthorized, onChatUpdated }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [memberUsername, setMemberUsername] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState('');
  const messagesListRef = useRef(null);

  useEffect(() => {
    const list = messagesListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    listMessages(token, chat.id, controller.signal).then(({ messages: loaded }) => {
      if (!controller.signal.aborted) {
        setMessages(current => mergeMessages(current, loaded));
      }
    }).catch(err => {
      if (controller.signal.aborted) return;
      if (err.status === 401) onUnauthorized('Session expired. Log in again.');
      else setError(`Cannot load messages: ${err.message}`);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [chat.id, token, onUnauthorized]);

  useEffect(() => {
    const socket = io({ auth: { token }, autoConnect: false });
    let active = true;
    let connectionRun = 0;

    socket.on('chat:message', message => {
      if (active && message?.chatId === chat.id) {
        setMessages(current => mergeMessages(current, [message]));
      }
    });

    socket.on('connect', async () => {
      const run = ++connectionRun;
      try {
        const joined = await socket.timeout(5000)
          .emitWithAck('chat:join', { chatId: chat.id });
        if (!active || connectionRun !== run) return;
        if (joined.ok !== true) {
          setError('This chat is no longer available.');
          socket.disconnect();
          return;
        }
        const { messages: latest } = await listMessages(token, chat.id);
        if (active && connectionRun === run) {
          setMessages(current => mergeMessages(current, latest));
        }
      } catch (err) {
        if (!active || connectionRun !== run) return;
        if (err.status === 401) onUnauthorized('Session expired. Log in again.');
        else setError(`Live message recovery failed: ${err.message}`);
      }
    });

    socket.on('connect_error', err => {
      if (!active) return;
      if (err.message === 'authentication required') {
        onUnauthorized('Session expired. Log in again.');
      } else {
        setError(`Live updates unavailable: ${err.message}`);
      }
    });

    socket.on('disconnect', reason => {
      ++connectionRun;
      if (!active) return;
      if (reason === 'io server disconnect') {
        onUnauthorized('Session expired. Log in again.');
      }
    });

    socket.connect();
    return () => {
      active = false;
      ++connectionRun;
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [chat.id, token, onUnauthorized]);

  async function handleSubmit(event) {
    event.preventDefault();
    const message = text.trim();
    if (!message || saving) return;
    setSaving(true);
    setError('');
    try {
      const { message: saved } = await postMessage(token, chat.id, message);
      setMessages(current => mergeMessages(current, [saved]));
      setText('');
    } catch (err) {
      if (err.status === 401) onUnauthorized('Session expired. Log in again.');
      else setError(`Cannot send message: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddMember(event) {
    event.preventDefault();
    if (!memberUsername.trim() || addingMember) return;
    setAddingMember(true);
    setMemberError('');
    try {
      const { chat: updated } = await addChatParticipant(token, chat.id, memberUsername);
      onChatUpdated(updated);
      setMemberUsername('');
    } catch (err) {
      if (err.status === 401) onUnauthorized('Session expired. Log in again.');
      else setMemberError(err.message === 'user not found'
        ? 'No account found with that username.' : err.message);
    } finally {
      setAddingMember(false);
    }
  }

  return (
    <section className="chat-panel" aria-label={`Chat with ${chat.username}`}>
      <h2>{chat.username}</h2>
      <p>Members: You, {(chat.participants ?? []).map(person => person.username).join(', ')}</p>
      <form className="add-member-form" onSubmit={handleAddMember}>
        <label htmlFor="add-member-username">Add someone to this chat</label>
        <input id="add-member-username" autoComplete="off" required minLength={3}
          maxLength={32} value={memberUsername}
          onChange={event => setMemberUsername(event.target.value)}
          placeholder="Enter an existing username" />
        <button type="submit" disabled={addingMember}>{addingMember ? 'Adding...' : 'Add member'}</button>
      </form>
      {memberError && <p role="alert">{memberError}</p>}
      {loading ? <p role="status">Loading messages...</p> : (
        messages.length === 0 ? <p className="empty-chat">No messages yet. Say hello!</p> :
          <ol ref={messagesListRef} className="messages" aria-live="polite">
            {messages.map(message => {
              const sender = message.senderId === userId
                ? username
                : chat.participants?.find(person => person.id === message.senderId)?.username
                  ?? 'Unknown user';
              return (
                <li key={message.id} className={message.senderId === userId ? 'message mine' : 'message'}>
                  <p className="message-sender">{sender}</p>
                  <p>{message.body}</p>
                  <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
                </li>
              );
            })}
          </ol>
      )}
      {error && <p role="alert">{error}</p>}
      <form className="message-form" onSubmit={handleSubmit}>
        <label htmlFor="new-message">Message</label>
        <textarea id="new-message" value={text} maxLength={2000} required
          onChange={event => setText(event.target.value)} />
        <button type="submit" disabled={saving || !text.trim()}>
          {saving ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  );
}
