import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from './modules/service.module';
import { ControllerModule } from './modules/controller.module';
import dbConfig from './config/db.config';
import { WinstonModule } from 'nest-winston';
import { WinstonOptions } from './config/log-config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfig,
      inject: [ConfigService],
    }),
    WinstonModule.forRoot(WinstonOptions),
    ServiceModule,
    ControllerModule,
  ],
})
export class AppModule {}
