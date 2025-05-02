import { Global, Module } from '@nestjs/common';
import { StoreMainSettingsService } from '../services/admin/store-main-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import dbConfig from '../config/db.config';

const storeServices = [];
const adminServices = [StoreMainSettingsService];

const services = [...storeServices, ...adminServices];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(dbConfig().entities as EntityClassOrSchema[]),
  ],
  providers: services,
  exports: services,
})
export class ServiceModule {}
