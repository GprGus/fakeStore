import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';

// Garante que a pasta logs/ existe
if (!existsSync('logs')) mkdirSync('logs');

// ─── Formato padrão ───
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? '\n' + JSON.stringify(meta, null, 2) : '';
    return `[${timestamp}] ${level.toUpperCase().padEnd(5)} │ ${message}${metaStr}`;
  })
);

// Formato colorido pro console
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    const icons = { info: '📋', warn: '⚠️ ', error: '❌', debug: '🔍' };
    return `${icons[level] || '•'} [${timestamp}] ${message}`;
  })
);

// ─── SYSTEM LOG ─── (geral: requests, startup, erros)
const system = winston.createLogger({
  level: 'debug',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/system.log', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.Console({ format: consoleFormat }),
  ],
});

// ─── DATABASE LOG ─── (MongoDB queries, inserts, updates)
const database = winston.createLogger({
  level: 'debug',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/database.log', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.Console({ format: consoleFormat }),
  ],
});

// ─── WHATSAPP LOG ─── (API requests e responses)
const whatsapp = winston.createLogger({
  level: 'debug',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/whatsapp.log', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.Console({ format: consoleFormat }),
  ],
});

// ─── Express middleware: loga cada request ───
function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    system[level](`${method} ${originalUrl} → ${status} (${ms}ms)`);
  });

  next();
}

export { system, database, whatsapp, requestLogger };
