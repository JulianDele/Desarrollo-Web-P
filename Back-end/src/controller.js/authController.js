const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/token');
const Session = require('../models/Session');
const crypto = require('crypto');

const users = [];

// registro
exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Datos inválidos" });
        }
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "Usuario ya existe" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now(),
            email,
            password: hashedPassword,
            role: role || "user"
        };
        users.push(newUser);
        res.json({ message: "Usuario registrado correctamente" });
    } catch {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// multisesión 
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const session = await Session.create({
            userId: user.id,
            tokenHash: accessToken,
            device: req.headers['user-agent'],
            ip: req.ip,
            expiresAt
        });
        res.json({
            message: "Login exitoso",
            user: { id: user.id, email: user.email },
            role: user.role,
            sessionId: session._id,
            expiresAt,
            accessToken,
            refreshToken
        });
    } catch {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// solo sesión actual
exports.logout = async (req, res) => {
    try {
        await Session.findByIdAndUpdate(req.session._id, { isActive: false });
        res.json({ message: "Logout exitoso" });
    } catch {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// all logout
exports.logoutAll = async (req, res) => {
    try {
        await Session.updateMany(
            { userId: req.user.id },
            { isActive: false }
        );
        res.json({ message: "Todas las sesiones cerradas" });
    } catch {
        res.status(500).json({ message: "Error del servidor" });
    }
};

exports.session = (req, res) => {
    res.json({ user: req.user });
};

// lista
exports.sessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            userId: req.user.id,
            isActive: true
        });
        res.json(sessions);
    } catch {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// refresh token
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh requerido" });
        }
        const decoded = verifyToken(refreshToken);
        const newAccessToken = generateToken(decoded);
        res.json({ accessToken: newAccessToken });
    } catch {
        res.status(401).json({ message: "Refresh inválido" });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const message = "Si el correo existe, se enviará un enlace";
        if (!email) {
            return res.json({ message });
        }
        const user = users.find(u => u.email === email);
        if (user) {
            const resetToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            user.resetToken = hashedToken;
            user.resetTokenExpires = Date.now() + 15 * 60 * 1000; 
            console.log("TOKEN (simulación email):", resetToken);
        }
        return res.json({ message });
    } catch (error) {
        return res.json({ message: "Si el proceso es válido, se completará" });
    }
};
