import { Module } from '@nestjs/common';
import { AdminStoreMainSettingsController } from '../controllers/admin/store-main-settings.controller';
import { StoreMainSettingsController } from '../controllers/store/store-main-settings.controller';

const storeControllers = [StoreMainSettingsController];

const adminControllers = [AdminStoreMainSettingsController];

@Module({
  controllers: [...storeControllers, ...adminControllers],
  providers: [],
})
export class ControllerModule {}
