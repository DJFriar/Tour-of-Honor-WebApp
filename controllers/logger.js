const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
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
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

exports.logger = logger