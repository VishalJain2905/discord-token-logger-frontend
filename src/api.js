/** Backend origin (no trailing slash). Production: https://discord-token-logger-backend.onrender.com */
function trimTrailingSlash(url) {
  if (typeof url !== 'string' || !url.trim()) return '';
  return url.replace(/\/$/, '');
}

export const API_ORIGIN =
  trimTrailingSlash(import.meta.env.VITE_API_ORIGIN) ||
  'https://discord-token-logger-backend.onrender.com';
