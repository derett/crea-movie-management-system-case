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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Crea Movie Management System Case Study')
    .setDescription(
      'API Service for Managers to organize Movies and Sessions, Customers to buy tickets, watch movies, view watch history',
    )
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(envConfig.port, envConfig.host);

  console.log(
    `${chalk.blue.bold(`[PID: ${process.pid}]`)} ${chalk.green.bold(
      '✓',
    )} Server is running on port ${chalk.white.bold(
      envConfig.port,
    )} in production mode`,
  );

  console.log(
    `${chalk.blue.bold(`[PID: ${process.pid}]`)} ${chalk.green.bold(
      '✓',
    )} Server is running on  ${chalk.white.bold(envConfig.host)}:${chalk.white.bold(envConfig.port)}`,
  );
  console.log(
    `${chalk.blue.bold(`[PID: ${process.pid}]`)} ${chalk.green.bold(
      '✓',
    )} Access Docs: ${envConfig.remote}:${envConfig.port}/doc`,
  );
  if (envConfig.productionMode) {
    console.log(`Server is running in production mode`);
  }

  logVersion();
}

if (args.includes('--version') || args.includes('-v')) {
  logVersion();
} else {
  bootstrap();
}
