const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
const appLogFile = path.join(logsDir, 'app.log');
const securityLogFile = path.join(logsDir, 'security.log');

const failedAttemptsByIp = {};

function ensureLogsDir() {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch {
    // ignore
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

const logger = (req, res, next) => {
  ensureLogsDir();

  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const timestamp = new Date().toISOString();
    const ip = getClientIp(req);

    const appLine = `[${timestamp}] ${req.method} ${req.url} -> ${res.statusCode} (${durationMs}ms) ip=${ip}\n`;
    fs.appendFile(appLogFile, appLine, (err) => {
      if (err) console.error('Error writing log:', err);
    });

    if (res.statusCode === 401 || res.statusCode === 403) {
      failedAttemptsByIp[ip] = (failedAttemptsByIp[ip] || 0) + 1;

      const userId = req.user?.id ?? null;
      const ua = req.headers['user-agent'] ?? null;

      const securityEvent = {
        timestamp,
        type: res.statusCode === 401 ? 'AUTH_FAILURE' : 'ACCESS_DENIED',
        method: req.method,
        url: req.url,
        status: res.statusCode,
        ip,
        userId,
        userAgent: ua,
        failedAttempts: failedAttemptsByIp[ip],
      };

      if (failedAttemptsByIp[ip] >= 5) {
        securityEvent.alert = 'POSSIBLE_ABUSE_DETECTED';
      }

      fs.appendFile(securityLogFile, JSON.stringify(securityEvent) + '\n', (err) => {
        if (err) console.error('Error writing security log:', err);
      });

      if (failedAttemptsByIp[ip] >= 5) {
        console.error('\x1b[31m%s\x1b[0m', `[SECURITY ALERT] ${JSON.stringify(securityEvent)}`);
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn('\x1b[33m%s\x1b[0m', `[SECURITY] ${JSON.stringify(securityEvent)}`);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      const line = `[${timestamp}] ${req.method} ${req.url} -> ${res.statusCode} (${durationMs}ms)`;
      if (res.statusCode >= 500) {
        console.error('\x1b[31m%s\x1b[0m', line);
      } else if (res.statusCode >= 400) {
        console.warn('\x1b[33m%s\x1b[0m', line);
      } else {
        console.log('\x1b[32m%s\x1b[0m', line);
      }
    } else {
      console.log(
        JSON.stringify({
          timestamp,
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration_ms: durationMs,
          ip,
        })
      );
    }
  });

  next();
};

module.exports = logger;
