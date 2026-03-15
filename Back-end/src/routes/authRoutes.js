const express = require('express');
const router = express.Router();

const { register, login, logout, session } = require('../controllers/authController');

const rateLimitLogin = require('../middleware/rateLimitLogin');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

router.post('/register', register);
router.post('/login', rateLimitLogin, login);
router.post('/logout', requireAuth, logout);
router.get('/session', requireAuth, session);

router.get('/admin', requireAuth, requireRole('admin'), (req, res) => {
    res.json({ message: "Bienvenido admin" });
});

module.exports = router;