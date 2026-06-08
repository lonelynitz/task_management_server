import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, type: 'access' },
    process.env.JWT_ACCESS_SECRET || '2Ydl7x4v73TnYfbljKqlweCFdKYO21zRRNQM6rgGrfR',
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'SYDs8gilxPgzvnPUwYqbTwIALcLlZrnptMEyTphxzYI',
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || '2Ydl7x4v73TnYfbljKqlweCFdKYO21zRRNQM6rgGrfR');
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'SYDs8gilxPgzvnPUwYqbTwIALcLlZrnptMEyTphxzYI');
}

export function getRefreshTokenExpiry() {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
}
