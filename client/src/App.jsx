import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { createChat, listChats, login, register } from './chatAPI.js';
import LoginForm from './LoginForm.jsx';
import ChatList from './ChatList.jsx';
import ChatPanel from './ChatPanel.jsx';

export default function App() {
  const [session, setSession] = useState(null);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [chatsBusy, setChatsBusy] = useState(false);
  const [chatsError, setChatsError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);
  const [createError, setCreateError] = useState('');

  const endSession = useCallback((message = '') => {
    setSession(null);
    setChats([]);
    setSelectedId(null);
    setLoginError(message);
  }, []);

  async function handleLogin(username, password) {
    setLoginBusy(true);
    setLoginError('');
    try {
      const result = await login(username, password);
      setSession({ token: result.token, user: result.user });
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleRegister(username, password) {
    setLoginBusy(true);
    setLoginError('');
    try {
      await register(username, password);
      const result = await login(username, password);
      setSession({ token: result.token, user: result.user });
    } catch (err) {
      const message = err.message === 'invalid registration input'
        ? 'Choose a username with 3–32 characters (letters, numbers, and underscores; it must start with a letter).'
        : err.message === 'username unavailable'
          ? 'That username is already taken. Try another one.'
          : err.message;
      setLoginError(message);
    } finally {
      setLoginBusy(false);
    }
  }

  useEffect(() => {
    if (!session) return undefined;
    const controller = new AbortController();
    setChatsBusy(true);
    setChatsError('');
    listChats(session.token, controller.signal).then(({ chats: loadedChats }) => {
      if (controller.signal.aborted) return;
      setChats(current => [
        ...current.filter(chat => !loadedChats.some(loaded => loaded.id === chat.id)),
        ...loadedChats
      ]);
      setSelectedId(current => current ?? loadedChats[0]?.id ?? null);
    }).catch(err => {
      if (controller.signal.aborted) return;
      if (err.status === 401) endSession('Session expired. Log in again.');
      else setChatsError(`Cannot load chats: ${err.message}`);
    }).finally(() => {
      if (!controller.signal.aborted) setChatsBusy(false);
    });
    return () => controller.abort();
  }, [session, endSession]);

  useEffect(() => {
    if (!session) return undefined;
    const socket = io({ auth: { token: session.token } });
    socket.on('chat:added', chat => {
      if (!chat?.id) return;
      setChats(current => [chat, ...current.filter(item => item.id !== chat.id)]);
      setSelectedId(current => current ?? chat.id);
    });
    socket.on('connect_error', err => {
      if (err.message === 'authentication required') {
        endSession('Session expired. Log in again.');
      }
    });
    return () => socket.disconnect();
  }, [session, endSession]);

  async function handleCreateChat(event) {
    event.preventDefault();
    if (!session || creatingChat) return;
    setCreatingChat(true);
    setCreateError('');
    try {
      const { chat } = await createChat(session.token, newUsername);
      setChats(current => [chat, ...current.filter(item => item.id !== chat.id)]);
      setSelectedId(chat.id);
      setNewUsername('');
    } catch (err) {
      if (err.status === 401) endSession('Session expired. Log in again.');
      else setCreateError(err.message === 'user not found'
        ? 'No account found with that username.' : err.message);
    } finally {
      setCreatingChat(false);
    }
  }

  if (!session) {
    return <main><h1>Messenger</h1>
      <LoginForm onLogin={handleLogin} onRegister={handleRegister}
        busy={loginBusy} error={loginError} />
    </main>;
  }

  const selectedChat = chats.find(chat => chat.id === selectedId);
  return (
    <main>
      <header className="app-header">
        <h1>Messenger</h1>
        <p>Signed in as {session.user.username}</p>
        <button type="button" onClick={() => endSession()}>Log out</button>
      </header>
      <form className="new-chat-form" onSubmit={handleCreateChat}>
        <label htmlFor="new-chat-username">Start a chat</label>
        <input id="new-chat-username" autoComplete="off" required minLength={3}
          maxLength={32} value={newUsername}
          onChange={event => setNewUsername(event.target.value)}
          placeholder="Enter an existing username" />
        <button type="submit" disabled={creatingChat}>
          {creatingChat ? 'Creating...' : 'Create chat'}
        </button>
      </form>
      {createError && <p role="alert">{createError}</p>}
      {chatsBusy && <p role="status">Loading chats...</p>}
      {chatsError && <p role="alert">{chatsError}</p>}
      <div className="messenger-layout">
        <ChatList chats={chats} selectedId={selectedId} onSelect={setSelectedId} />
        {selectedChat ? <ChatPanel key={selectedChat.id} chat={selectedChat}
          token={session.token} userId={session.user.id} username={session.user.username}
          onUnauthorized={endSession}
          onChatUpdated={updated => setChats(current => current.map(item => item.id === updated.id ? updated : item))} />
          : <section className="empty-chat"><p>Select a chat or start a new one.</p></section>}
      </div>
    </main>
  );
}
