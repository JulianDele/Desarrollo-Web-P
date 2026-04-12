const jwt = require('jsonwebtoken');

const DEV_FALLBACK_SECRET = 'devsecret';
const SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : DEV_FALLBACK_SECRET);

if (!SECRET) {
  throw new Error('JWT_SECRET no está definido en variables de entorno');
}

function getAccessExpiration() {
  return process.env.TOKEN_EXPIRATION || '1h';
}

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      type: 'access',
    },
    SECRET,
    { expiresIn: getAccessExpiration() }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      type: 'refresh',
    },
    SECRET,
    { expiresIn: '7d' }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
