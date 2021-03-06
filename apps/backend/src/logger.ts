import { createLogger, format, transports } from 'winston';

const _logger = createLogger({
  transports: [
    new transports.Console({
      level: 'silly',
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export const baseLogger = (level: string, msg: string): void => {
  _logger.log(level, msg);
};

export const infoLogger = (msg: string): void => {
  _logger.info(msg);
};

export const errorLogger = (msg: string): void => {
  _logger.error(msg);
};
