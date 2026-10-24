import { useState } from 'react';

export default function LoginForm({ onLogin, busy, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    void onLogin(username, password);
  }
   return (
    <form onSubmit={handleSubmit}>
      <h2>Log in to Study Boards</h2>
      <label htmlFor="username">Username</label>
      <input id="username" autoComplete="username" required
        value={username} onChange={(event) => setUsername(event.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete="current-password" required
        value={password} onChange={(event) => setPassword(event.target.value)} />
      <button disabled={busy} type="submit">
        {busy ? 'Checking credentials...' : 'Log in'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}