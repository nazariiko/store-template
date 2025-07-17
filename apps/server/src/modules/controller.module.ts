import { Module } from '@nestjs/common';
import { AdminStoreMainSettingsController } from '../controllers/admin/store-main-settings.controller';
import { StoreMainSettingsController } from '../controllers/store/store-main-settings.controller';
import { AdminUserRoleController } from 'src/controllers/admin/user-role.controller';
import { AuthModule } from 'src/modules/auth.module';
import { AdminUserRightController } from 'src/controllers/admin/user-right.controller';

const storeControllers = [StoreMainSettingsController];

const adminControllers = [
  AdminStoreMainSettingsController,
  AdminUserRoleController,
  AdminUserRightController,
];

@Module({
  imports: [AuthModule],

  controllers: [...storeControllers, ...adminControllers],
})
export class ControllerModule {}
