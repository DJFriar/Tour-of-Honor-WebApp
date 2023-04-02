const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const appLogRotateTransport = new transports.DailyRotateFile({
  filename: `logs/app-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '45k',
});

const dbLogRotateTransport = new transports.DailyRotateFile({
  filename: `logs/db-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '45k',
});

const exceptionLogRotateTransport = new transports.DailyRotateFile({
  filename: `logs/exceptions-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '45k',
});

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
  transports: [appLogRotateTransport],
  exceptionHandlers: [exceptionLogRotateTransport],
  rejectionHandlers: [exceptionLogRotateTransport],
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
  level: 'warn',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: 'TourOfHonor-DB' },
  transports: [dbLogRotateTransport],
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
