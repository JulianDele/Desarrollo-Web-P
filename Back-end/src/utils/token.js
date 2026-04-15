const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;

const ACCESS_EXPIRES = process.env.TOKEN_EXPIRATION || process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!ACCESS_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET no está definido en variables de entorno');
  }
  console.warn('JWT_SECRET no definido; usando fallback de desarrollo');
}

const DEV_FALLBACK_SECRET = 'devsecret';
const EFFECTIVE_ACCESS_SECRET = ACCESS_SECRET || DEV_FALLBACK_SECRET;
const EFFECTIVE_REFRESH_SECRET = REFRESH_SECRET || EFFECTIVE_ACCESS_SECRET;

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      type: 'access',
    },
    EFFECTIVE_ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      type: 'refresh',
    },
    EFFECTIVE_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, EFFECTIVE_ACCESS_SECRET);
  } catch (error) {
    if (EFFECTIVE_REFRESH_SECRET !== EFFECTIVE_ACCESS_SECRET) {
      return jwt.verify(token, EFFECTIVE_REFRESH_SECRET);
    }
    throw error;
  }
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, EFFECTIVE_REFRESH_SECRET);
};

