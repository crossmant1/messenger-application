import { useEffect, useState } from 'react';
import { listMessages, postMessage } from './chatAPI.js';

export default function ChatPanel({ chat, token, userId, onUnauthorized }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    listMessages(token, chat.id, controller.signal).then(({ messages: loaded }) => {
      if (!controller.signal.aborted) setMessages(loaded);
    }).catch(err => {
      if (controller.signal.aborted) return;
      if (err.status === 401) onUnauthorized('Session expired. Log in again.');
      else setError(`Cannot load messages: ${err.message}`);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [chat.id, token, onUnauthorized]);

  async function handleSubmit(event) {
    event.preventDefault();
    const message = text.trim();
    if (!message || saving) return;
    setSaving(true);
    setError('');
    try {
      const { message: saved } = await postMessage(token, chat.id, message);
      setMessages(current => [...current, saved]);
      setText('');
    } catch (err) {
      if (err.status === 401) onUnauthorized('Session expired. Log in again.');
      else setError(`Cannot send message: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="chat-panel" aria-label={`Chat with ${chat.username}`}>
      <h2>{chat.username}</h2>
      {loading ? <p role="status">Loading messages...</p> : (
        messages.length === 0 ? <p className="empty-chat">No messages yet. Say hello!</p> :
          <ol className="messages" aria-live="polite">
            {messages.map(message => (
              <li key={message.id} className={message.senderId === userId ? 'message mine' : 'message'}>
                <p>{message.body}</p>
                <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
              </li>
            ))}
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
