const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    if (process.env.NODE_ENV === "production") {
        throw new Error("JWT secrets son obligatorios en producción");
    } else {
        console.warn("JWT secrets no definidos correctamente");
    }
}
exports.generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            type: "access"
        },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES }
    );
};
exports.verifyToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            type: "refresh"
        },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES }
    );
};
exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};