const { createLogger, format, transports } = require('winston');
// const { LogtailTransport } = require('@logtail/winston');
// const { Logtail } = require('@logtail/node');

// Logtail Setup
// const logtailSourceToken = process.env.LOGTAIL_SOURCE_TOKEN;
// const logtail = new Logtail(logtailSourceToken);

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
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log' }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/UncaughtExceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/PromiseRejections.log' })],
});

// // When in Production, send the app logs to Logtail
// if (process.env.NODE_ENV !== 'Development') {
//   logger.add(new LogtailTransport(logtail));
// }

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

// // When in Production, send the DB logs to Logtail
// if (process.env.NODE_ENV !== 'Development') {
//   dblogger.add(new LogtailTransport(logtail));
// }

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
