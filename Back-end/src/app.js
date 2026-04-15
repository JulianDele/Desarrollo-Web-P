const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const logger = require('./middleware/logger');
const requireAuth = require('./middleware/requireAuth');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '20mb' }));
app.use(logger);

// HTTPS obligatorio en producción (Render / reverse proxies suelen setear `x-forwarded-proto`)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const forwardedProto = req.headers['x-forwarded-proto'];
    if (forwardedProto && forwardedProto !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }
    next();
  });
}

// CORS por lista (coma-separada) para soportar Render Static Site + localhost
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const defaultDevOrigins = new Set(['http://localhost:5173', 'http://localhost:3000']);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.length > 0) {
        return callback(null, allowedOrigins.includes(origin));
      }

      return callback(null, defaultDevOrigins.has(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check para CI smoke test y monitoreo
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de autenticación
app.use('/api', authRoutes);

// Rutas demo (algunas protegidas)
app.get('/api/items', requireAuth, (req, res) => {
  res.json([
    { id: 1, name: 'Elemento A', status: 'Activo' },
    { id: 2, name: 'Elemento B', status: 'Inactivo' },
  ]);
});

app.get('/api/items-delay', requireAuth, (req, res) => {
  setTimeout(() => {
    res.json([
      { id: 1, name: 'Elemento A', status: 'Activo' },
      { id: 2, name: 'Elemento B', status: 'Inactivo' },
    ]);
  }, 2000);
});

app.get('/api/error', (req, res) => {
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.get('/api/state-ok', (req, res) => {
  res.json({ status: 'activo', selected: true });
});

app.get('/api/state-error', (req, res) => {
  res.status(500).json({ status: 'error', message: 'fallo al cambiar el estado' });
});

app.get('/api/network-error', (req, res) => {
  res.status(503).json({ message: 'servicio no disponible' });
});

app.get('/api/flaky', (req, res) => {
  const falla = Math.random() < 0.5;
  if (falla) {
    res.status(500).json({ message: 'error en el servidor' });
  } else {
    res.json({ data: 'datos cargados correctamente' });
  }
});

app.get('/api/bad-request', (req, res) => {
  res.status(400).json({ message: 'solicitud invalida' });
});

app.get('/api/not-found', (req, res) => {
  res.status(404).json({ message: 'recurso no encontrado' });
});

// Monitoreo de errores (no filtra detalles sensibles al cliente)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const timestamp = new Date().toISOString();

  console.error(
    JSON.stringify({
      timestamp,
      type: 'error',
      method: req.method,
      url: req.originalUrl,
      status,
      message: err.message,
    })
  );

  const safeMessage = status >= 500 ? 'Error interno del servidor' : err.message;
  res.status(status).json({ message: safeMessage || 'Error' });
});

module.exports = app;

