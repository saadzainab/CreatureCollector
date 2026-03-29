import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/api';

function Dashboard({ username, onLogout }) {
  const [creatures, setCreatures] = useState([]);
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch creatures when the Dashboard first mounts
  useEffect(() => {
    apiRequest('/creatures')
      .then((data) => {
        if (Array.isArray(data)) {
          setCreatures(data);
        } else {
          setError(data.error || 'Failed to load creatures');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, []);

  const addCreature = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');

    const result = await apiRequest('/creatures', {
      method: 'POST',
      body: JSON.stringify({ name, power }),
    });

    setAdding(false);

    if (result._id) {
      setCreatures([result, ...creatures]); // add to top of list
      setName('');
      setPower('');
    } else {
      setError(result.error || 'Failed to add creature');
    }
  };

  const deleteCreature = async (id) => {
    const result = await apiRequest(`/creatures/${id}`, { method: 'DELETE' });
    if (result.message) {
      setCreatures(creatures.filter((c) => c._id !== id));
    } else {
      setError(result.error || 'Failed to delete creature');
    }
  };

  const handleLogout = async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    onLogout();
  };

  // Stretch goal: filter by search term
  const filtered = creatures.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <h1>🐾 Creature Collector</h1>
          <p className="subtitle">Welcome back, <strong>{username}</strong>!</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="msg-error">{error}</p>}

      {/* ── Add Creature Form ── */}
      <div className="card">
        <h3>➕ Add New Creature</h3>
        <form className="add-form" onSubmit={addCreature}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Creature name (e.g. Pikachu)"
            required
          />
          <input
            value={power}
            onChange={(e) => setPower(e.target.value)}
            placeholder="Power (e.g. Electric)"
          />
          <button type="submit" className="btn-primary" disabled={adding}>
            {adding ? 'Adding...' : 'Add Creature'}
          </button>
        </form>
      </div>

      {/* ── Creature List ── */}
      <div className="card">
        <div className="list-header">
          <h3>📋 Your Creatures ({creatures.length})</h3>
          {/* Stretch goal: search/filter */}
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search creatures..."
          />
        </div>

        {loading ? (
          <p className="loading">Loading your creatures...</p>
        ) : filtered.length === 0 ? (
          <p className="empty">
            {search ? 'No creatures match your search.' : 'No creatures yet. Add one above!'}
          </p>
        ) : (
          <ul className="creature-list">
            {filtered.map((c) => (
              <li key={c._id} className="creature-item">
                <span className="creature-info">
                  <span className="creature-name">{c.name}</span>
                  <span className="creature-power">⚡ {c.power || 'Unknown'}</span>
                </span>
                <button
                  className="btn-delete"
                  onClick={() => deleteCreature(c._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
