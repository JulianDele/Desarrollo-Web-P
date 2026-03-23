const jwt = require('jsonwebtoken');

const DEV_FALLBACK_SECRET = 'devsecret';
const SECRET =
  process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : DEV_FALLBACK_SECRET);

if (!SECRET) {
  throw new Error('JWT_SECRET no está definido en variables de entorno');
}

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' });
};
