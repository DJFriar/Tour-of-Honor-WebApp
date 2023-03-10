const { createLogger, format, transports } = require('winston');

const errorFilter = format((info, opts) => (info.level === 'error' ? info : false));

const infoFilter = format((info, opts) => (info.level === 'info' ? info : false));

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'TourOfHonor-Web' },
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: format.combine(
        errorFilter(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
    }),
    new transports.File({
      filename: 'logs/info.log',
      level: 'info',
      format: format.combine(
        infoFilter(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.splat(),
        format.json(),
      ),
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/UncaughtExceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/PromiseRejections.log' })],
});

// If we're not in Production then **ALSO** log to the `console`
// with the colorized simple format.
if (process.env.NODE_ENV === 'Development') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss Z',
        }),
        format.align(),
        format.printf(
          (info) => `${info.level} @ [${info.timestamp}] : ${info.calledFrom} - ${info.message}`,
        ),
      ),
    }),
  );
}

const dblogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: 'TourOfHonor-DB' },
  transports: [
    new transports.File({ filename: 'logs/db-error.log', level: 'error' }),
    new transports.File({ filename: 'logs/db-info.log' }),
  ],
});

// If we're not in Production then **ALSO** log to the `console`
// with the colorized simple format.
if (process.env.NODE_ENV === 'Development') {
  dblogger.add(
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss Z',
        }),
        format.align(),
        format.printf((info) => `DB.${info.level} @ ${info.timestamp}: ${info.message}`),
      ),
    }),
  );
}

exports.logger = logger;
exports.dblogger = dblogger;
