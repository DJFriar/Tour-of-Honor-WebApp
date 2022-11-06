const { createLogger, format, transports } = require('winston');
const { LogtailTransport } = require('@logtail/winston');
const { Logtail } = require('@logtail/node');
require('winston-daily-rotate-file');

// Logtail Setup
// const logtailSourceID = process.env.LOGTAIL_SOURCE_ID;
const logtailSourceToken = process.env.LOGTAIL_SOURCE_TOKEN;
const logtail = new Logtail(logtailSourceToken);

// eslint-disable-next-line no-unused-vars
const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/info-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
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
  transports: [
    // new LogtailTransport(logtail),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log' }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/UncaughtExceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/PromiseRejections.log' })],
});

// When in Production, send the logs to Logtail
if (process.env.NODE_ENV !== 'Development') {
  logger.add(new LogtailTransport(logtail));
}

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
  defaultMeta: { service: 'TourOfHonor DB' },
  transports: [
    new transports.File({ filename: 'logs/db-error.log', level: 'error' }),
    new transports.File({ filename: 'logs/db-info.log' }),
  ],
});

exports.logger = logger;
exports.dblogger = dblogger;
