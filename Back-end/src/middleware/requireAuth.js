const users = require('../data/users'); 
const { verifyToken } = require('../utils/token');
const responses = require('../utils/responses');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return responses.unauthorized(res, "Token requerido");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return responses.unauthorized(res, "Token no proporcionado");
    }
    try {
        const decoded = verifyToken(token);
        if (decoded.type !== "access") {
            return responses.unauthorized(res, "Token inválido");
        }
        const user = users.find(u => u.id === decoded.id);
        if (!user) {
            return responses.unauthorized(res, "Usuario no encontrado");
        }
        req.user = {
            id: user.id,
            role: user.role
        };
        next();
    } catch (error) {
        return responses.unauthorized(res, "Token inválido o expirado");
    }
};