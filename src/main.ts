import chalk from 'chalk';

import multiPart from '@fastify/multipart';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from 'compression';
import { ValidationError } from 'class-validator';

import envConfig from 'src/shared/configs/env.config';
import serverLogger from 'src/shared/loggers/server.logger';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';
import { GlobalExceptionFilter } from 'src/shared/filters/exception.filter';

import { AppModule } from './app/app.module';

import { version } from '../package.json';
import { join } from 'path';

const args = process.argv.slice(2);

const logVersion = () => {
  console.log(`Version Info: ${version}`);
};

const getErrorsRecursive = (
  validationErrors: ValidationError[],
  errorMessages: string[],
) => {
  validationErrors.forEach((error) => {
    if (error.constraints) {
      Object.keys(error.constraints).forEach((key: string) => {
        errorMessages.push(error.constraints[key]);
      });
      return;
    } else if (error.children && error.children.length > 0) {
      return getErrorsRecursive(error.children, errorMessages);
    }
  });
};

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: serverLogger,
    bodyLimit: 1024 * 1024 * 1024,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: envConfig.productionMode
        ? ['warn', 'error']
        : ['debug', 'error', 'log', 'verbose', 'warn'],
    },
  );

  app.use(compression());

  app.getHttpAdapter().getInstance().register(multiPart, { addToBody: true });

  fastifyAdapter.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errorMessages: string[] = [];
        getErrorsRecursive(validationErrors, errorMessages);
        return new ServerError(
          ServerErrorType.GIVEN_INPUT_IS_INVALID,
          errorMessages.join(','),
        );
      },
    }),
  );

  app.useStaticAssets({ root: join(process.cwd(), 'public') });

  await app.listen(envConfig.port, '0.0.0.0');

  if (envConfig.productionMode) {
    console.log(
      `${chalk.blue.bold(`[PID: ${process.pid}]`)} ${chalk.green.bold(
        '✓',
      )} Server is running on port ${chalk.white.bold(
        envConfig.port,
      )} in production mode`,
    );
  }

  logVersion();
}

if (args.includes('--version') || args.includes('-v')) {
  logVersion();
} else {
  bootstrap();
}
