const express = require('express');
const router = express.Router();

const { register, login, logout, session, logoutAll, sessions, refresh, forgotPassword, validateResetToken, resetPassword } = require('../controllers/authController');
const rateLimitLogin = require('../middleware/rateLimitLogin');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const rateLimitPassword = require('../middleware/rateLimitPassword');

router.post('/register', register);
router.post('/login', rateLimitLogin, login);
router.post('/logout', requireAuth, logout);
router.get('/session', requireAuth, session);
router.post('/logout-all', requireAuth, logoutAll);
router.get('/sessions', requireAuth, sessions);
router.post('/refresh', refresh);
router.post('/forgot-password', rateLimitPassword, forgotPassword);
router.post('/reset-password/validate', rateLimitPassword, validateResetToken);
router.post('/reset-password', rateLimitPassword, resetPassword);

router.get('/admin', requireAuth, requireRole('admin'), (req, res) => {
    res.json({ message: "Bienvenido admin" });
});

module.exports = router;
