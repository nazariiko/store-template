import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const WinstonOptions: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'MM.DD YYYY, HH:mm:ss.SSS' }),
        winston.format.ms(),
        utilities.format.nestLike('App', { colors: true, prettyPrint: true }),
      ),
      level: 'debug',
    }),
    new winston.transports.File({
      dirname: 'log',
      filename: 'logError.txt',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.json(),
      ),
    }),
  ],
};
