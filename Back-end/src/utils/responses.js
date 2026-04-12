module.exports = {
    unauthorized: (res) =>
        res.status(401).json({ error: "No autenticado" }),

    forbidden: (res) =>
        res.status(403).json({ error: "Sin permisos" })
};