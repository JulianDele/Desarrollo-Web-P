fs = require('fs');
const path = require('path');

// Ruta carpeta logs
const logDir = path.join(__dirname, '../../logs');

// Crear carpeta logs si no existe
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Rutas archivos log
const logFile = path.join(logDir, 'app.log');
const securityLogFile = path.join(logDir, 'security.log');

// Contador de intentos fallidos por IP
const failedAttempts = {};

const logger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

        // Escribir al archivo app.log
        const logLine = `[${timestamp}] ${req.method} ${req.url} → ${res.statusCode} (${duration}ms) IP:${ip}\n`;
        fs.appendFile(logFile, logLine, (err) => {
            if (err) console.error('Error writing log:', err);
        });

        // Monitoreo de eventos de seguridad (401, 403)
        if (res.statusCode === 401 || res.statusCode === 403) {
            failedAttempts[ip] = (failedAttempts[ip] || 0) + 1;

            const securityLog = {
                timestamp,
                type: res.statusCode === 401 ? 'AUTH_FAILURE' : 'ACCESS_DENIED',
                method: req.method,
                url: req.url,
                status: res.statusCode,
                ip,
                failedAttempts: failedAttempts[ip]
            };

            // Alerta si hay 5 o más intentos repetidos desde la misma IP
            if (failedAttempts[ip] >= 5) {
                securityLog.alert = 'POSIBLE_ATAQUE_DETECTADO';
                console.error('\x1b[31m%s\x1b[0m', `[ALERTA SEGURIDAD] ${JSON.stringify(securityLog)}`);
            } else {
                console.warn('\x1b[33m%s\x1b[0m', `[SEGURIDAD] ${JSON.stringify(securityLog)}`);
            }

            // Guardar en archivo security.log separado
            fs.appendFile(securityLogFile, JSON.stringify(securityLog) + '\n', (err) => {
                if (err) console.error('Error writing security log:', err);
            });
        }

        // Log normal en consola con color según status
        if (process.env.NODE_ENV !== 'production') {
            const line = `[${timestamp}] ${req.method} ${req.url} → ${res.statusCode} (${duration}ms)`;
            if (res.statusCode >= 500) {
                console.error('\x1b[31m%s\x1b[0m', line);
            } else if (res.statusCode >= 400) {
                console.warn('\x1b[33m%s\x1b[0m', line);
            } else {
                console.log('\x1b[32m%s\x1b[0m', line);
            }
        } else {
            console.log(JSON.stringify({
                timestamp,
                method: req.method,
                url: req.url,
                status: res.statusCode,
                duration_ms: duration,
                ip
            }));
        }
    });

    next();
};

module.exports = logger;