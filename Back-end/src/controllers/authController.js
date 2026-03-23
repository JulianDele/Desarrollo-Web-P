const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/token');
const mongoose = require('mongoose');
const Session = require('../models/Session');
const sessionStore = require('../utils/sessionStore');

const users = [];

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      role: role || 'user',
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

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

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
