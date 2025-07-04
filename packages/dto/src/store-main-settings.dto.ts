import { IBaseCreatedUpdated } from './base/base-created-updated.model';
import { IStoreTheme } from './store-theme.dto';

export interface IStoreMainSettings extends IBaseCreatedUpdated {
  logoUrl: string;
  isCommentsEnabled: boolean;
  isFavoritesEnabled: boolean;
  isProductRatingEnabled: boolean;
  isSearchInHeaderEnabled: boolean;
  isUserAuthEnabled: boolean;
  storeThemeId: number;
  storeTheme: IStoreTheme;
}

export interface IGetStoreInitialSettingsResponse extends IBaseCreatedUpdated {
  storeTheme: IStoreTheme;
}

export interface IGetStoreHeaderSettingsResponse extends IBaseCreatedUpdated {
  isFavoritesEnabled: boolean;
  isSearchInHeaderEnabled: boolean;
  isUserAuthEnabled: boolean;
  isThemeTogglerEnabled: boolean;
  storeTheme: IStoreTheme;
}
