const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');

const users = [];
// Registro
exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Datos inválidos" });
        }
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "Error al registrar usuario" });
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
    } catch (error) {
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
        const token = generateToken(user);
        res.json({
            message: "Login exitoso",
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
};
// Logout
exports.logout = (req, res) => {
    res.json({ message: "Logout exitoso" });
};
// Session
exports.session = (req, res) => {
    res.json({
        user: req.user
    });
};