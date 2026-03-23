const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../logs/app.log');

const logger = (req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

    fs.appendFile(logFile, log, (err) => {
        if (err) {
            console.error("Error writing log:", err);
        }
    });

    next();
};

module.exports = logger;