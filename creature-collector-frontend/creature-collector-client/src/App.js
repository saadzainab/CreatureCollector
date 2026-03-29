import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [view, setView] = useState('login');       // 'login' | 'register' | 'dashboard'
  const [username, setUsername] = useState('');

  const handleLogin = (name) => {
    setUsername(name);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUsername('');
    setView('login');
  };

  if (view === 'dashboard') {
    return <Dashboard username={username} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-wrapper">
      {view === 'login' ? (
        <Login
          onLogin={handleLogin}
          onGoToRegister={() => setView('register')}
        />
      ) : (
        <Register onGoToLogin={() => setView('login')} />
      )}
    </div>
  );
}

export default App;
