import moment from 'moment';
import pino from 'pino';

import envConfig from 'src/shared/configs/env.config';

export default pino(
  {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: false,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'level,pid,hostname',
        messageFormat: '[REQUEST]\t{msg}\n',
      },
    },
  },
  envConfig.productionMode
    ? pino.destination(
        `logs/${moment().format('YYYY-MM-DD')}_${process.pid}.log`,
      )
    : null,
);
