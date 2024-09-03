import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { loadNumber, loadString } from '../helpers/env.helper';
import serverLogger from '../loggers/server.logger';

export default {
  type: 'postgres',
  dialect: 'postgres',
  host: loadString('DB_HOST', { defaultValue: 'localhost' }),
  port: loadNumber('DB_PORT', { defaultValue: 5432 }),
  logging: (sql) => serverLogger.info(sql),
  native: false,
  username: loadString('DB_USER'),
  password: loadString('DB_PASS'),
  database: loadString('DB_NAME'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  sync: {
    alter: true,
    force: false,
  },
  synchronize: true,
  autoLoadModels: true,
  define: {
    underscored: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
} as SequelizeModuleOptions;
