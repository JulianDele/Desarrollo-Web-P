const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');
const Session = require('../models/Session');
const crypto = require('crypto');
const users = require('../data/users');
const responses = require('../utils/responses');

const ROLES = {
    ADMIN: "admin",
    RECEPCIONISTA: "recepcionista",
    CLIENTE: "cliente"
};

// Registro
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return responses.badRequest(res, "Datos inválidos");
        }
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return responses.badRequest(res, "Usuario ya existe");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now(),
            email,
            password: hashedPassword,
            role: ROLES.CLIENTE
        };
        users.push(newUser);
        return responses.success(res, {
            user: { id: newUser.id, email: newUser.email }
        }, "Usuario registrado correctamente");
    } catch (error) {
        console.error("ERROR REGISTER:", error);
        return responses.serverError(res);
    }
};
// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return responses.badRequest(res, "Credenciales inválidas");
        }
        const user = users.find(u => u.email === email);
        if (!user) {
            return responses.unauthorized(res, "Credenciales inválidas");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return responses.unauthorized(res, "Credenciales inválidas");
        }
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        return responses.success(res, {
            user: { id: user.id, email: user.email },
            role: user.role,
            expiresAt,
            accessToken,
            refreshToken
        }, "Login exitoso");
    } catch (error) {
        console.error("ERROR LOGIN:", error);
        return responses.serverError(res);
    }
};
// Logout
exports.logout = async (req, res) => {
    try {
        await Session.findByIdAndUpdate(req.session?._id, { isActive: false });
        return responses.success(res, {}, "Logout exitoso");
    } catch {
        return responses.serverError(res);
    }
};
// logout-all
exports.logoutAll = async (req, res) => {
    try {
        await Session.updateMany(
            { userId: req.user.id },
            { isActive: false }
        );
        return responses.success(res, {}, "Todas las sesiones cerradas");
    } catch {
        return responses.serverError(res);
    }
};
// sesión actual
exports.session = (req, res) => {
    return responses.success(res, { user: req.user }, "Sesión activa");
};
// lista de sesiones
exports.sessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            userId: req.user.id,
            isActive: true
        });
        return responses.success(res, sessions, "Sesiones activas");
    } catch {
        return responses.serverError(res);
    }
};
// Refresh token
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return responses.badRequest(res, "Refresh requerido");
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded.type !== "refresh") {
            return responses.unauthorized(res, "Token inválido");
        }
        const newAccessToken = generateToken(decoded);
        return responses.success(res, {
            accessToken: newAccessToken
        }, "Token renovado");
    } catch {
        return responses.unauthorized(res, "Refresh inválido o expirado");
    }
};
// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const message = "Si el correo existe, se enviará un enlace";
        if (!email) {
            return responses.success(res, {}, message);
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
        return responses.success(res, {}, message);
    } catch {
        return responses.success(res, {}, "Si el proceso es válido, se completará");
    }
};
// Validación de reset token
exports.validateResetToken = async (req, res) => {
    try {
        const { token } = req.body;
        const message = "Solicitud procesada";
        if (!token) {
            return responses.success(res, { valid: false }, message);
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
            return responses.success(res, { valid: false }, message);
        }
        return responses.success(res, { valid: true }, message);
    } catch {
        return responses.success(res, { valid: false }, "Solicitud procesada");
    }
};
// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const message = "Si el proceso es válido, la contraseña fue actualizada";
        if (!token || !newPassword) {
            return responses.success(res, {}, message);
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
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetToken = null;
            user.resetTokenExpires = null;

            await Session.updateMany(
                { userId: user.id },
                { isActive: false }
            );
        }
        return responses.success(res, {}, message);
    } catch {
        return responses.success(res, {}, "Si el proceso es válido, se completará");
    }
};