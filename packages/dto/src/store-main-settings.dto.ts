import { IStoreTheme } from './store-theme.dto';

export interface IStoreMainSettings {
  id: number;
  logoUrl: string;
  isCommentsEnabled: boolean;
  isFavoritesEnabled: boolean;
  isProductRatingEnabled: boolean;
  isRequirePhoneOnRegistrationEnabled: boolean;
  isSearchInHeaderEnabled: boolean;
  isUserAuthEnabled: boolean;
  storeThemeId: number;
  storeTheme: IStoreTheme;
}

export interface IGetStoreInitialSettingsResponse {
  id: number;
  storeTheme: IStoreTheme;
}

export interface IGetStoreHeaderSettingsResponse {
  id: number;
  isFavoritesEnabled: boolean;
  isSearchInHeaderEnabled: boolean;
  isUserAuthEnabled: boolean;
}
