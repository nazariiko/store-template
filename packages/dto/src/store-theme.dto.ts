import { IBaseCreatedUpdated } from './base/base-created-updated.model';

export interface IStoreTheme extends IBaseCreatedUpdated {
  name: string;
  alias: string;
}
