const mongoose = require('mongoose');
const Session = require('../models/Session');
const sessionStore = require('../utils/sessionStore');
const { verifyToken } = require('../utils/token');
const users = require('../data/users');
const responses = require('../utils/responses');

function getBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

module.exports = async (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) return responses.unauthorized(res);

  try {
    const decoded = verifyToken(token);

    if (decoded.type !== 'access') {
      return responses.unauthorized(res);
    }

    const useDatabase = mongoose.connection.readyState === 1;
    const session = useDatabase ? await Session.findOne({ tokenHash: token }) : sessionStore.getSessionByToken(token);

    if (!session || !session.isActive) {
      return responses.unauthorized(res);
    }

    if (new Date() > session.expiresAt) {
      return responses.unauthorized(res);
    }

    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return responses.unauthorized(res);
    }

    // Avoid privilege escalation: do not trust token payload beyond user id.
    req.user = { id: user.id, role: user.role };
    req.session = session;
    return next();
  } catch {
    return responses.unauthorized(res);
  }
};

