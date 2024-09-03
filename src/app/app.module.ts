import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseConfig from 'src/shared/configs/database.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DataModule } from 'src/modules/data/data.module';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    UsersModule,
    AuthModule,
    DataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
