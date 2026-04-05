const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/token');
const Session = require('../models/Session');
const crypto = require('crypto');
const users = require('../data/users');

const ROLES = {
    ADMIN: "admin",
    RECEPCIONISTA: "recepcionista",
    CLIENTE: "cliente"
};
// Registro
exports.register = async (req, res) => {
    try {
        const { email, password, } = req.body;
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
            role: ROLES.CLIENTE
        };
        users.push(newUser);
        res.json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("ERROR REGISTER:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Login
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
        res.json({
            message: "Login exitoso",
            user: { id: user.id, email: user.email },
            role: user.role,
            expiresAt,
            accessToken,
            refreshToken
        });
    } catch (error){
        console.error("ERROR REGISTER:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        await Session.findByIdAndUpdate(req.session._id, { isActive: false });
        res.json({ message: "Logout exitoso" });
    } catch {
        res.status(500).json({ message: "Error del servidor" });
    }
};

// logout-all
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

// lista de sesiones
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

// Refresh token
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh requerido" });
        }
        const decoded = verifyToken(refreshToken);
        if (decoded.type !== "refresh") {
            return res.status(401).json({ message: "Token inválido" });
      }
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

// Validación de reset token
exports.validateResetToken = async (req, res) => {
    try {
        const { token } = req.body;
        const message = "Solicitud procesada";
        if (!token) {
            return res.json({ valid: false, message });
        }
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = users.find(u =>
            u.resetToken === hashedToken &&
            u.resetTokenExpires > Date.now()
        );
        if (!user) {
            return res.json({ valid: false, message });
        }
        return res.json({ valid: true, message });
    } catch (error) {
        return res.json({ valid: false, message: "Solicitud procesada" });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const message = "Si el proceso es válido, la contraseña fue actualizada";
        if (!token || !newPassword) {
            return res.json({ message });
        }
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = users.find(u =>
            u.resetToken === hashedToken &&
            u.resetTokenExpires > Date.now()
        );
        if (user) {
            // Hash de nueva contraseña (bcrypt)
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetToken = null;
            user.resetTokenExpires = null;
            await Session.updateMany(
                { userId: user.id },
                { isActive: false }
            );
        }
        return res.json({ message });
    } catch (error) {
        return res.json({ message: "Si el proceso es válido, se completará" });
    }
};