const crypto = require('crypto');

const sessionsByToken = new Map();
const sessionsById = new Map();

function createSession({ userId, tokenHash, device, ip, expiresAt }) {
  const id = crypto.randomUUID();
  const session = {
    _id: id,
    userId,
    tokenHash,
    device,
    ip,
    isActive: true,
    expiresAt,
  };

  sessionsByToken.set(tokenHash, session);
  sessionsById.set(id, session);
  return session;
}

function getSessionByToken(tokenHash) {
  return sessionsByToken.get(tokenHash) || null;
}

function deactivateSession(id) {
  const session = sessionsById.get(id);
  if (!session) return false;
  session.isActive = false;
  return true;
}

function deactivateAllForUser(userId) {
  for (const session of sessionsById.values()) {
    if (session.userId === userId) session.isActive = false;
  }
}

function getActiveSessionsForUser(userId) {
  return Array.from(sessionsById.values()).filter(
    (session) => session.userId === userId && session.isActive
  );
}

module.exports = {
  createSession,
  getSessionByToken,
  deactivateSession,
  deactivateAllForUser,
  getActiveSessionsForUser,
};
