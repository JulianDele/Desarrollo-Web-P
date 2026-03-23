const mongoose = require('mongoose');
const { verifyToken } = require('../utils/token');
const Session = require('../models/Session');
const sessionStore = require('../utils/sessionStore');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    const useDatabase = mongoose.connection.readyState === 1;
    const session = useDatabase
      ? await Session.findOne({ tokenHash: token })
      : sessionStore.getSessionByToken(token);

    if (!session || !session.isActive) {
      return res.status(401).json({ message: 'Sesión inválida' });
    }

    if (new Date() > session.expiresAt) {
      return res.status(401).json({ message: 'Sesión expirada' });
    }

    req.user = decoded;
    req.session = session;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
