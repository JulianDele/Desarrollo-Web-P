const crypto = require('crypto');

const DEV_FALLBACK_SECRET = 'dev-reset-secret';

function getResetSecret() {
  return (
    process.env.RESET_TOKEN_SECRET ||
    (process.env.NODE_ENV === 'production' ? null : DEV_FALLBACK_SECRET)
  );
}

function getTtlMinutes() {
  const raw = process.env.RESET_TOKEN_TTL_MINUTES || process.env.RESET_TOKEN_TTL;
  const value = Number(raw);
  if (Number.isFinite(value) && value > 0) return value;
  return 15;
}

function hashToken(token) {
  const secret = getResetSecret();
  if (!secret) {
    throw new Error('RESET_TOKEN_SECRET no está definido en variables de entorno');
  }

  return crypto.createHash('sha256').update(`${token}:${secret}`).digest('hex');
}

function generateToken() {
  // 32 bytes => 64 hex chars.
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  getTtlMinutes,
  hashToken,
  generateToken,
};
