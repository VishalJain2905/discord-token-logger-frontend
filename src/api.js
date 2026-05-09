/** Backend origin (no trailing slash). 
 * Auto-detects: if frontend runs on localhost:3000 → API defaults to localhost:8080
 * Production: https://discord-token-logger-backend.onrender.com
 */
function trimTrailingSlash(url) {
  if (typeof url !== 'string' || !url.trim()) return '';
  return url.replace(/\/$/, '');
}

function getDefaultApiOrigin() {
  // If frontend is on localhost, default to local backend too
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8080';
  }
  // Production: use Render backend
  return 'https://discord-token-logger-backend.onrender.com';
}

export const API_ORIGIN =
  trimTrailingSlash(import.meta.env.VITE_API_ORIGIN) ||
  getDefaultApiOrigin();
