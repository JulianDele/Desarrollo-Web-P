const crypto = require('crypto');

const tokensByHash = new Map();

function now() {
  return new Date();
}

function create({ userId, tokenHash, expiresAt, requestedIp, userAgent }) {
  const record = {
    _id: crypto.randomUUID(),
    userId,
    tokenHash,
    expiresAt,
    usedAt: null,
    requestedIp,
    userAgent,
    createdAt: now(),
  };

  tokensByHash.set(tokenHash, record);
  return record;
}

function findValid(tokenHash) {
  const record = tokensByHash.get(tokenHash);
  if (!record) return null;
  if (record.usedAt) return null;
  if (now() > record.expiresAt) return null;
  return record;
}

function markUsed(tokenHash) {
  const record = tokensByHash.get(tokenHash);
  if (!record) return false;
  record.usedAt = now();
  return true;
}

function invalidateAllForUser(userId) {
  for (const record of tokensByHash.values()) {
    if (record.userId === userId && !record.usedAt) {
      record.usedAt = now();
    }
  }
}

module.exports = {
  create,
  findValid,
  markUsed,
  invalidateAllForUser,
};
