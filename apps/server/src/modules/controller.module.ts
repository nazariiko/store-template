import { Module } from '@nestjs/common';
import { AdminStoreMainSettingsController } from '../controllers/admin/store-main-settings.controller';
import { StoreMainSettingsController } from '../controllers/store/store-main-settings.controller';
import { AdminUserRoleController } from 'src/controllers/admin/user-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/store/user.entity';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/auth/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth.module';

const storeControllers = [StoreMainSettingsController];

const adminControllers = [
  AdminStoreMainSettingsController,
  AdminUserRoleController,
];

@Module({
  imports: [AuthModule],

  controllers: [...storeControllers, ...adminControllers],
})
export class ControllerModule {}
