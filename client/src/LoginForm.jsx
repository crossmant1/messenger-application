import { useState } from 'react';

export default function LoginForm({ onLogin, onRegister, busy, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    void (creatingAccount ? onRegister(username, password) : onLogin(username, password));
  }
  const action = creatingAccount ? 'Create account' : 'Log in';
   return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{creatingAccount ? 'Create your account' : 'Log in to Study Boards'}</h2>
      <label htmlFor="username">Username</label>
      <input id="username" autoComplete="username" required minLength={3} maxLength={32}
        pattern="[A-Za-z][A-Za-z0-9_]{2,31}"
        title="Use 3–32 letters, numbers, or underscores, starting with a letter."
        value={username} onChange={(event) => setUsername(event.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete={creatingAccount ? 'new-password' : 'current-password'} required
        value={password} onChange={(event) => setPassword(event.target.value)} />
      <button disabled={busy} type="submit">
        {busy ? (creatingAccount ? 'Creating account...' : 'Checking credentials...') : action}
      </button>
      {error && <p role="alert">{error}</p>}
      <p className="account-switch">
        {creatingAccount ? 'Already have an account?' : 'New to Study Boards?'}{' '}
        <button type="button" className="link-button" disabled={busy}
          onClick={() => setCreatingAccount((value) => !value)}>
          {creatingAccount ? 'Log in' : 'Create an account'}
        </button>
      </p>
    </form>
  );
}
