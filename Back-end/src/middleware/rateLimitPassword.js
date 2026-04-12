const attempts = {};

module.exports = (req, res, next) => {
    const ip = req.ip;
    if (!attempts[ip]) {
        attempts[ip] = { count: 0, time: Date.now() };
    }
    const diff = Date.now() - attempts[ip].time;
    if (diff > 60000) {
        attempts[ip] = { count: 0, time: Date.now() };
    }
    if (attempts[ip].count >= 5) {
        return res.status(429).json({
            message: "Demasiados intentos, intenta más tarde"
        });
    }
    attempts[ip].count++;
    next();
};