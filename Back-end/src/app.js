const express = require('express'); 
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middleware/requireAuth');

const app = express();

app.use(express.json());

const allowedOrigin = process.env.CORS_ORIGIN;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    credentials: true
}));

app.use('/api', authRoutes);
app.get('/api/items', requireAuth, (req, res) =>{
    res.json([
        { id: 1, name: 'Elemento A', status: 'Activo'}, 
        { id: 2, name: 'Elemento B', status: 'Inactivo'}
    ]);
});
app.get('/api/error', (req, res) =>{
    res.status(500).json({ message: 'Error interno del servidor' });
});
app.get('/api/state-ok', (req, res) => {
    res.json({ status: 'activo', selected: true });
});
app.get('/api/state-error', (req, res) => {
    res.status(500).json({ status: 'error', message: 'fallo al cambiar el estado' });
});
// delay
app.get('/api/items-delay', requireAuth, (req, res) => {
    setTimeout(() => {
        res.json([
            { id: 1, name: 'Elemento A', status: 'Activo'}, 
            { id: 2, name: 'Elemento B', status: 'Inactivo'}
        ]);
    }, 2000);
});
app.get('/api/network-error', (req, res) => {
    res.status(503).json({ message: 'servicio no disponible'});
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
    res.status(400).json({ message: 'solicitud invalida'});
});
app.get('/api/not-found', (req, res) => {
    res.status(404).json({ message: 'recurso no encontrado'});
});
// health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'servicio activo' });
});

module.exports = app;