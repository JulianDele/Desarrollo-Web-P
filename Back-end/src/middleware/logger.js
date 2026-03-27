const fs = require('fs');
const path = require('path');

// Ruta carpeta logs
const logDir = path.join(__dirname, '../../logs');

// Crear carpeta logs si no existe
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Ruta archivo log
const logFile = path.join(logDir, 'app.log');

const logger = (req, res, next) => {
    const start = Date.now();

    //  Esperamos a que la respuesta termine para tener status + duración
    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();

        // Línea para el archivo (siempre texto plano)
        const logLine = `[${timestamp}] ${req.method} ${req.url} → ${res.statusCode} (${duration}ms)\n`;

        //  Escribir al archivo app.log
        fs.appendFile(logFile, logLine, (err) => {
            if (err) console.error('Error writing log:', err);
        });

        //  Imprimir en consola con color según status
        if (process.env.NODE_ENV !== 'production') {
            const line = `[${timestamp}] ${req.method} ${req.url} → ${res.statusCode} (${duration}ms)`;
            if (res.statusCode >= 500) {
                console.error('\x1b[31m%s\x1b[0m', line);      // rojo   → errores server
            } else if (res.statusCode >= 400) {
                console.warn('\x1b[33m%s\x1b[0m', line);       // amarillo → errores cliente
            } else {
                console.log('\x1b[32m%s\x1b[0m', line);        // verde  → OK
            }
        } else {
            // En producción: JSON estructurado (compatible con Railway, Render, etc.)
            console.log(JSON.stringify({
                timestamp,
                method: req.method,
                url: req.url,
                status: res.statusCode,
                duration_ms: duration,
                ip: req.ip
            }));
        }
    });

    next();
};

module.exports = logger;