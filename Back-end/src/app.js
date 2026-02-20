const express = require('express');
const app = express();

app.use(express.json());

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

module.exports = app;