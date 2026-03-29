import React, { useState } from 'react';
import { apiRequest } from '../api/api';

function Login({ onLogin, onGoToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (result.message === 'Login successful') {
      onLogin(result.username); // tell App.js to show the Dashboard
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>🎮 Welcome Back!</h2>
      <p className="subtitle">Log in to manage your creatures</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p className="msg-error">{error}</p>}

      <p className="switch-link">
        No account yet?{' '}
        <button className="link-btn" onClick={onGoToRegister}>
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
