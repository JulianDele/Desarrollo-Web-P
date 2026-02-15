const express = require('express');
const app = express();

app.use(express.json());

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

module.exports = app;