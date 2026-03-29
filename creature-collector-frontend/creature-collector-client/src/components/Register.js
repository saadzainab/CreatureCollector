import React, { useState } from 'react';
import { apiRequest } from '../api/api';

function Register({ onGoToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (result.message) {
      setIsError(false);
      setMessage(result.message);
      setUsername('');
      setPassword('');
    } else {
      setIsError(true);
      setMessage(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>🐾 Create Account</h2>
      <p className="subtitle">Join the Creature Collector world!</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
            minLength={3}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password (min 6 chars)"
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {message && (
        <p className={isError ? 'msg-error' : 'msg-success'}>{message}</p>
      )}

      <p className="switch-link">
        Already have an account?{' '}
        <button className="link-btn" onClick={onGoToLogin}>
          Log in here
        </button>
      </p>
    </div>
  );
}

export default Register;
