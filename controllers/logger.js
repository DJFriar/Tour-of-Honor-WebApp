const { createLogger, format, transports } = require('winston');
const { LogtailTransport } = require("@logtail/winston");
const { Logtail } = require("@logtail/node");
require('winston-daily-rotate-file');

const logtail = new Logtail("exLRQGDX5nxmtFxMmip9FRjV");

const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'TourOfHonor' },
  transports: [
    new LogtailTransport(logtail),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log' })
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'Production') {
  logger.add(new transports.Console({
    // format: format.combine(
    //   format.colorize(),
    //   format.simple()
    // )
    format: format.combine(
      format.colorize({ all: true }),
      format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      format.align(),
      format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
  }));
}

exports.logger = logger