import { IBaseCreatedUpdated } from './base/base-created-updated.model';

export interface IUserRole extends IBaseCreatedUpdated {
  name: string;
  alias: string;
}
