import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAccount } from '../api';

export default function CreateAccount() {
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
      await createAccount(username, password);
      alert('Account sucessfully created.')
      navigate('/login');
    } catch (err) {
      setError(`Failed to create an account: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }
    return (
    <main>
      <h1>Create an Account</h1>
      <p>Please enter your usename and password create an account</p>
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
          {submitting ? 'Creating' : 'Create'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}

        <div>
          <p>Already have an account?</p>
          <Link to="/login">Login</Link>
        </div>
    </main>
  );
}