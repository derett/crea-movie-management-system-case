import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ModelCtor } from 'sequelize-typescript';

export default function (models: ModelCtor[]) {
  return {
    dialect: 'sqlite',
    logging: false,
    models,
    storage: ':memory:',
    autoLoadModels: true,
    synchronize: true,
  } as SequelizeModuleOptions;
}
