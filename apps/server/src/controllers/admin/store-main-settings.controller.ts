import { Controller } from '@nestjs/common';
import { StoreMainSettingsService } from '../../services/admin/store-main-settings.service';

@Controller('admin/store-main-settings')
export class AdminStoreMainSettingsController {
  constructor(
    private readonly _storeMainSettingsService: StoreMainSettingsService,
  ) {}
}
