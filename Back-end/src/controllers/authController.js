const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/token');
const mongoose = require('mongoose');
const Session = require('../models/Session');
const sessionStore = require('../utils/sessionStore');
const PasswordResetToken = require('../models/PasswordResetToken');
const resetTokenStore = require('../utils/resetTokenStore');
const { generateToken: generateResetToken, hashToken: hashResetToken, getTtlMinutes } = require('../utils/resetToken');

const users = require('../data/users');

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const requestedRole = typeof role === 'string' ? role.trim().toLowerCase() : 'user';

    const existingUser = users.find((u) => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      email: normalizedEmail,
      password: hashedPassword,
      role: requestedRole || 'user',
    };

    users.push(newUser);
    return res.json({ message: 'Usuario registrado correctamente' });
  } catch {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const decoded = jwt.decode(accessToken);
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 60 * 60 * 1000);

    const sessionData = {
      userId: user.id,
      tokenHash: accessToken,
      device: req.headers['user-agent'],
      ip: req.ip,
      expiresAt,
    };

    const useDatabase = mongoose.connection.readyState === 1;
    const session = useDatabase ? await Session.create(sessionData) : sessionStore.createSession(sessionData);

    return res.json({
      message: 'Login exitoso',
      user: { id: user.id, email: user.email },
      role: user.role,
      sessionId: session._id,
      expiresAt,
      accessToken,
      refreshToken,
    });
  } catch {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.logout = async (req, res) => {
  try {
    const useDatabase = mongoose.connection.readyState === 1;
    if (useDatabase) {
      await Session.findByIdAndUpdate(req.session._id, { isActive: false });
    } else {
      sessionStore.deactivateSession(req.session._id);
    }
    return res.json({ message: 'Logout exitoso' });
  } catch {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    const useDatabase = mongoose.connection.readyState === 1;
    if (useDatabase) {
      await Session.updateMany({ userId: req.user.id }, { isActive: false });
    } else {
      sessionStore.deactivateAllForUser(req.user.id);
    }
    return res.json({ message: 'Todas las sesiones cerradas' });
  } catch {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.session = (req, res) => {
  return res.json({ user: req.user });
};

exports.sessions = async (req, res) => {
  try {
    const useDatabase = mongoose.connection.readyState === 1;
    const sessions = useDatabase
      ? await Session.find({ userId: req.user.id, isActive: true })
      : sessionStore.getActiveSessionsForUser(req.user.id);
    return res.json(sessions);
  } catch {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh requerido' });
    }

    const decoded = verifyToken(refreshToken);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Refresh invÃ¡lido' });
    }
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Refresh inválido' });
    }

    const accessToken = generateToken(user);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Refresh inválido' });
  }
};

const FORGOT_PASSWORD_NEUTRAL_MESSAGE =
  'Si el correo existe, se enviará un enlace para recuperar la contraseña.';

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

function getResetExpiresAt() {
  const ttlMinutes = getTtlMinutes();
  return new Date(Date.now() + ttlMinutes * 60 * 1000);
}

exports.forgotPassword = async (req, res) => {
  // Always respond neutral to prevent user enumeration.
  const { email } = req.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail) {
    return res.status(200).json({ message: FORGOT_PASSWORD_NEUTRAL_MESSAGE });
  }

  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return res.status(200).json({ message: FORGOT_PASSWORD_NEUTRAL_MESSAGE });
  }

  try {
    const rawToken = generateResetToken();
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = getResetExpiresAt();

    // Invalidate previous unused tokens for this user (best-effort).
    if (isMongoConnected()) {
      await PasswordResetToken.updateMany(
        { userId: user.id, usedAt: null },
        { $set: { usedAt: new Date() } }
      );

      await PasswordResetToken.create({
        userId: user.id,
        tokenHash,
        expiresAt,
        requestedIp: req.ip,
        userAgent: req.headers['user-agent'],
      });
    } else {
      resetTokenStore.invalidateAllForUser(user.id);
      resetTokenStore.create({
        userId: user.id,
        tokenHash,
        expiresAt,
        requestedIp: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    // TODO: integrar proveedor de correo transaccional.
    // En tests devolvemos el token para validar el flujo sin email.
    if (process.env.NODE_ENV === 'test') {
      return res.status(200).json({
        message: FORGOT_PASSWORD_NEUTRAL_MESSAGE,
        testToken: rawToken,
      });
    }

    console.log('Password reset token generated for', normalizedEmail);
    return res.status(200).json({ message: FORGOT_PASSWORD_NEUTRAL_MESSAGE });
  } catch {
    // Still neutral.
    return res.status(200).json({ message: FORGOT_PASSWORD_NEUTRAL_MESSAGE });
  }
};

exports.validateResetToken = async (req, res) => {
  const { token } = req.body || {};
  if (!token || typeof token !== 'string') {
    return res.status(200).json({ valid: false });
  }

  try {
    const tokenHash = hashResetToken(token);
    const now = new Date();

    const record = isMongoConnected()
      ? await PasswordResetToken.findOne({ tokenHash, usedAt: null, expiresAt: { $gt: now } })
      : resetTokenStore.findValid(tokenHash);

    return res.status(200).json({ valid: Boolean(record) });
  } catch {
    return res.status(200).json({ valid: false });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body || {};

  if (!token || typeof token !== 'string' || !newPassword || typeof newPassword !== 'string') {
    return res.status(400).json({ message: 'Solicitud inválida' });
  }

  if (newPassword.trim().length < 8) {
    return res.status(400).json({ message: 'Contraseña inválida' });
  }

  try {
    const tokenHash = hashResetToken(token);
    const now = new Date();

    const record = isMongoConnected()
      ? await PasswordResetToken.findOne({ tokenHash, usedAt: null, expiresAt: { $gt: now } })
      : resetTokenStore.findValid(tokenHash);

    if (!record) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const user = users.find((u) => u.id === record.userId);
    if (!user) {
      // Token valid but user missing (shouldn't happen); treat as invalid.
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    // Mark token as used (single use) and revoke sessions.
    if (isMongoConnected()) {
      await PasswordResetToken.updateOne({ _id: record._id }, { $set: { usedAt: now } });
      await Session.updateMany({ userId: user.id }, { isActive: false });
    } else {
      resetTokenStore.markUsed(tokenHash);
      sessionStore.deactivateAllForUser(user.id);
    }

    return res.status(200).json({ message: 'Contraseña actualizada' });
  } catch {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
