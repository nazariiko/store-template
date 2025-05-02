import { Controller, Get } from '@nestjs/common';
import { StoreMainSettingsService } from '../../services/admin/store-main-settings.service';
import {
  IGetStoreHeaderSettingsResponse,
  IGetStoreInitialSettingsResponse,
} from '@repo/dto';

@Controller('store-main-settings')
export class StoreMainSettingsController {
  constructor(
    private readonly _storeMainSettingsService: StoreMainSettingsService,
  ) {}

  @Get('initial')
  public async getInitialSettings(): Promise<IGetStoreInitialSettingsResponse> {
    const item = (await this._storeMainSettingsService.findOneByOptions({
      where: { id: 1 },
      relations: { storeTheme: true },
      select: {
        id: true,
        storeTheme: {
          id: true,
          name: true,
          alias: true,
        },
      },
    })) as IGetStoreInitialSettingsResponse;

    return item;
  }

  @Get('header')
  public async getHeaderSettings(): Promise<IGetStoreHeaderSettingsResponse> {
    const item = (await this._storeMainSettingsService.findOneByOptions({
      where: { id: 1 },
      select: {
        id: true,
        isFavoritesEnabled: true,
        isSearchInHeaderEnabled: true,
        isUserAuthEnabled: true,
      },
    })) as IGetStoreHeaderSettingsResponse;
    return item;
  }
}
