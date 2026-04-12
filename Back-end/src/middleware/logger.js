fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
const appLogFile = path.join(logsDir, 'app.log');
const securityLogFile = path.join(logsDir, 'security.log');

function ensureLogsDir() {
    try {
        fs.mkdirSync(logsDir, { recursive: true });
    } catch {
        // ignore
    }
}

const logger = (req, res, next) => {
    ensureLogsDir();

    const startedAt = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - startedAt;
        const line = `${new Date().toISOString()} ${req.method} ${req.url} ${res.statusCode} ${durationMs}ms\n`;

        fs.appendFile(appLogFile, line, (err) => {
            if (err) {
                console.error("Error writing log:", err);
            }
        });

        if (res.statusCode === 401 || res.statusCode === 403) {
            const userId = req.user?.id ? ` user=${req.user.id}` : '';
            const ua = req.headers['user-agent'] ? ` ua="${req.headers['user-agent']}"` : '';
            const ip = req.ip ? ` ip=${req.ip}` : '';
            const securityLine = `${new Date().toISOString()} ${res.statusCode} ${req.method} ${req.url}${userId}${ip}${ua}\n`;
            fs.appendFile(securityLogFile, securityLine, () => {});
        }
    });

    next();
};

module.exports = logger;
