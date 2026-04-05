const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const logger = require('./middleware/logger');

// Validar variables de entorno requeridas al arranque
const requiredEnvVars = [
    'JWT_SECRET', 'REFRESH_SECRET', 'RESET_TOKEN_SECRET',
    'DB_URI', 'REDIS_URI', 'MAIL_USER', 'MAIL_PASS'
];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    console.error(` Variables de entorno faltantes: ${missingVars.join(', ')}`);
    process.exit(1);
}

const app = express();
// Headers de seguridad
app.use(helmet());
app.use(logger);  // ← aquí
app.use(express.json());

//  HTTPS obligatorio en producción
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, 'https://' + req.headers.host + req.url);
    }
    next();
});

// CORS restringido
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


//  Health check para CI smoke test y monitoreo
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Rutas de autenticación
app.use('/api', authRoutes);
//http 200
app.get('/api/items', (req, res) =>{
    res.json([{ id: 1, name: 'Elemento A', status: 'Activo'}, { id: 2, name: 'Elemento B', status: 'Inactivo'}]);
})
app.get('/api/error', (req, res) =>{
    res.status(500).json({ message: 'Error interno del servidor' });
})
app.get('/api/state-ok', (req, res) => {
    res.json({ status: 'activo', selected: true });
});
app.get('/api/state-error', (req, res) => {
    res.status(500).json({ status: 'error', message: 'fallo al cambiar el estado' });
});
// Simula una respuesta 200 con retraso para probar el manejo de tiempos de espera
app.get('/api/items-delay', (req, res) => {
    setTimeout(() => {
        res.json([{ id: 1, name: 'Elemento A', status: 'Activo'}, { id: 2, name: 'Elemento B', status: 'Inactivo'}]);
    }, 2000);
});
// Simula un error de red para probar el manejo de errores de red
app.get('/api/network-error', (req, res) => {
    res.status(503).json({ message: 'servicio no disponible'});
});
// Simula una respuesta intermitente para probar el manejo de errores intermitentes
app.get('/api/flaky', (req, res) => {
    const falla = Math.random() < 0.5;
    if ( falla) {
        res.status(500).json({ message: 'error en el servidor' });
    } else {
        res.json({ data: 'datos cargados correctamente' });
    } 
});
//error 400 controlado para el cliente
app.get('/api/bad-request', (req, res) => {
    res.status(400).json({ message: 'solicitud invalida'});
});
//error 404 controlado
app.get('/api/not-found', (req, res) => {
    res.status(404).json({ message: 'recurso no encontrado'});
});

// Monitoreo de eventos críticos de auth
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.error(JSON.stringify({
        timestamp,
        type: 'error',
        method: req.method,
        url: req.originalUrl,
        status: err.status || 500,
        message: err.message
    }));
    res.status(err.status || 500).json({ message: err.message || 'Error interno' });
});

module.exports = app;