import { useState } from 'react';
import { createChat } from '../api';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      await createChat(username.trim(), message.trim());
      setUsername('');
      setMessage('');
      setStatus('Chat created.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>New chat</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />

        <button type="submit" disabled={submitting || !username.trim() || !message.trim()}>
          {submitting ? 'Creating...' : 'Create chat'}
        </button>
      </form>
      {status && <p role="status">{status}</p>}
    </main>
  );
}
