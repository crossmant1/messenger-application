import { useEffect, useState } from 'react';
import { createChat, getChats, getMessages, sendMessage } from '../api';

function chatLabel(chat, currentUserId) {
  if (chat.isGroupChat) return chat.chat;
  return chat.participants
    .filter((user) => String(user._id) !== String(currentUserId))
    .map((user) => user.username)
    .join(', ') || chat.chat;
}

// Pass the user returned by login: <Dashboard currentUser={user} />
export default function Dashboard({ currentUser }) {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [messagesError, setMessagesError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    setChats([]);
    setSelectedChatId(null);
    setLoadingChats(true);
    getChats(userId, controller.signal)
      .then((list) => {
        setChats(list);
        setSelectedChatId(list[0]?.id ?? null);
        setError('');
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingChats(false);
      });
    return () => controller.abort();
  }, [userId]);

  useEffect(() => {
    if (!userId || !selectedChatId) {
      setMessages([]);
      return;
    }
    const controller = new AbortController();
    setMessages([]);
    setMessagesError('');
    setLoadingMessages(true);
    getMessages(userId, selectedChatId, controller.signal)
      .then(setMessages)
      .catch((err) => {
        if (err.name !== 'AbortError') setMessagesError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingMessages(false);
      });
    return () => controller.abort();
  }, [userId, selectedChatId]);

  async function handleCreate(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { chat } = await createChat(userId, username.trim());
      setChats((previous) => [chat, ...previous.filter((item) => item.id !== chat.id)]);
      setSelectedChatId(chat.id);
      setUsername('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!selectedChatId || !text) return;
    setBusy(true);
    setMessagesError('');
    try {
      const { message } = await sendMessage(userId, selectedChatId, text);
      setMessages((previous) => [...previous, message]);
      setChats((previous) => {
        const chat = previous.find((item) => item.id === selectedChatId);
        return chat ? [chat, ...previous.filter((item) => item.id !== selectedChatId)] : previous;
      });
      setDraft('');
    } catch (err) {
      setMessagesError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh() {
    setLoadingMessages(true);
    setMessagesError('');
    try {
      setMessages(await getMessages(userId, selectedChatId));
    } catch (err) {
      setMessagesError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  }

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  return (
    <main>
      <h1>Chats</h1>
      {!userId && <p>Log in to view your chats.</p>}
      {userId && <>
        <form onSubmit={handleCreate}>
          <label htmlFor="username">Start a chat with username</label>
          <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <button type="submit" disabled={busy || !username.trim()}>Create chat</button>
        </form>
        {error && <p role="alert">{error}</p>}

        <section aria-label="Your chats">
          <h2>Your chats</h2>
          {loadingChats && <p>Loading chats...</p>}
          {!loadingChats && chats.length === 0 && <p>No chats yet.</p>}
          <ul>
            {chats.map((chat) => <li key={chat.id}>
              <button type="button" onClick={() => setSelectedChatId(chat.id)}
                aria-current={selectedChatId === chat.id ? 'true' : undefined}>
                {chatLabel(chat, userId)}
              </button>
            </li>)}
          </ul>
        </section>

        {selectedChat && <section aria-label="Conversation">
          <h2>{chatLabel(selectedChat, userId)}</h2>
          <button type="button" onClick={handleRefresh} disabled={loadingMessages}>Refresh messages</button>
          {loadingMessages && <p>Loading messages...</p>}
          {messagesError && <p role="alert">{messagesError}</p>}
          <ul>
            {messages.map((item) => <li key={item.id}>
              <strong>{item.sender.username}</strong>: {item.message}
            </li>)}
          </ul>
          <form onSubmit={handleSend}>
            <label htmlFor="draft">Message</label>
            <input id="draft" value={draft} onChange={(event) => setDraft(event.target.value)} required />
            <button type="submit" disabled={busy || loadingMessages || !draft.trim()}>Send</button>
          </form>
        </section>}
      </>}
    </main>
  );
}
