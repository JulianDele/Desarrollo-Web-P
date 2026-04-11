const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const logger = require('./middleware/logger');
const requireAuth = require('./middleware/requireAuth');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(logger);

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
  })
);

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

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'servicio activo' });
});

module.exports = app;
