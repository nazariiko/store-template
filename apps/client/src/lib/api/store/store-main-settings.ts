import { baseServerUrl } from "@/lib/api";
import {
  IGetStoreHeaderSettingsResponse,
  IGetStoreInitialSettingsResponse,
} from "@repo/dto";

export const getStoreInitialSettings =
  async (): Promise<IGetStoreInitialSettingsResponse> => {
    const data = await fetch(`${baseServerUrl}/store-main-settings/initial`);
    return data.json();
  };

export const getStoreHeaderSettings =
  async (): Promise<IGetStoreHeaderSettingsResponse> => {
    const data = await fetch(`${baseServerUrl}/store-main-settings/header`);
    return data.json();
  };
