const { verifyToken } = require('../utils/token');

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No autorizado" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};