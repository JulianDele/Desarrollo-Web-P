const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "secret_key";
exports.generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        SECRET,
        { expiresIn: "1h" }
    );
};
exports.verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};