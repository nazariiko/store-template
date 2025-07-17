import { Global, Module } from '@nestjs/common';
import { StoreMainSettingsService } from '../services/admin/store-main-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import dbConfig from '../config/db.config';
import { UserUserRoleService } from 'src/services/admin/user-user-role.service';
import { UserRoleService } from 'src/services/admin/user-role.service';
import { UserRoleUserRightService } from 'src/services/admin/user-role-user-right.service';
import { UserRightService } from 'src/services/admin/user-right.service';

const storeServices = [];
const adminServices = [
  StoreMainSettingsService,
  UserUserRoleService,
  UserRoleService,
  UserRoleUserRightService,
  UserRightService,
];

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
