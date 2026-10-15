import { useState } from 'react';
import { login } from '../api.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    if(!username.trim || !password.trim()) {
        setError('Please enter both a username and password.')
        return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login(username, password);
      navigate('/')
    } catch (err) {
      setError(`Failed to login: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }
    return (
    <main>
      <h1>Login</h1>
      <p>Please enter your usename and password to authenticate</p>
      <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" disabled={submitting} onChange={(event) => setUsername(event.target.value)} />
        </div>

        <div>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' value={password} disabled={submitting} onChange={(event) => setPassword(event.target.value)} />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}

        <div>
          <p>No account?</p>
          <Link to="/register">Create one</Link>
        </div>
    </main>
  );
}