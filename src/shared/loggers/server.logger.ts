import { existsSync, mkdirSync } from 'fs';
import moment from 'moment';
import pino from 'pino';

import envConfig from 'src/shared/configs/env.config';

if (!existsSync('logs')) {
  mkdirSync('logs');
}

export default pino(
  {
    level: envConfig.logsDisabled ? 'error' : 'trace',
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    transport: {
      target: 'pino-pretty',
      options: envConfig.logsDisabled
        ? null
        : { translateTime: true, levelFirst: true },
    },
    serializers: {
      res(reply) {
        // The default
        return {
          statusCode: reply.statusCode,
        };
      },
      req(request) {
        if (request.method === 'OPTIONS') {
          return;
        }

        return {
          method: request.method,
          url: request.url,
          path: request.routerPath,
          parameters: request.params,
        };
      },
    },
  },
  envConfig.logsDisabled
    ? pino.destination(
        `logs/${moment().format('YYYY-MM-DD')}_${process.pid}.log`,
      )
    : null,
);
