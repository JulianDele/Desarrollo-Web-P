const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const token = jwt.sign({ sub: username, email, role: 'ADMIN' }, jwtSecret, {
    expiresIn: '1h',
  });

  return res.json({ role: 'ADMIN', token });
});

app.get('/api/items', (req, res) => {
  res.json([
    { id: 1, name: 'Elemento A', status: 'Activo' },
    { id: 2, name: 'Elemento B', status: 'Inactivo' },
  ]);
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

app.get('/api/items-delay', (req, res) => {
  setTimeout(() => {
    res.json([
      { id: 1, name: 'Elemento A', status: 'Activo' },
      { id: 2, name: 'Elemento B', status: 'Inactivo' },
    ]);
  }, 2000);
});

app.get('/api/network-error', (req, res) => {
  res.status(503).json({ message: 'servicio no disponible' });
});

app.get('/api/flaky', (req, res) => {
  const falla = Math.random() < 0.5;

  if (falla) {
    res.status(500).json({ message: 'error en el servidor' });
    return;
  }

  res.json({ data: 'datos cargados correctamente' });
});

app.get('/api/bad-request', (req, res) => {
  res.status(400).json({ message: 'solicitud invalida' });
});

app.get('/api/not-found', (req, res) => {
  res.status(404).json({ message: 'recurso no encontrado' });
});

app.use(express.static(frontendDistPath));

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'recurso no encontrado' });
});

app.use((req, res) => {
  if (fs.existsSync(frontendIndexPath)) {
    return res.sendFile(frontendIndexPath);
  }

  return res.status(404).json({ message: 'frontend build no encontrado' });
});

module.exports = app;
