const BASE_URL = 'http://localhost:5000';

/**
 * Wrapper around fetch that:
 *  - Always sends cookies (credentials: 'include') so JWT + session cookies travel with every request
 *  - Sets Content-Type to JSON
 *  - Returns parsed JSON
 */
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',           // ← sends JWT cookie & session cookie automatically
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return response.json();
}
