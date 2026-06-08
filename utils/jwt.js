import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export function getRefreshTokenExpiry() {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
}
