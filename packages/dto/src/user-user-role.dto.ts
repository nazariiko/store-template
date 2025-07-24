import { IBaseCreatedUpdated } from './base/base-created-updated.model';
import { IUserRole } from './user-role.dto';

export interface IUserUserRole extends IBaseCreatedUpdated {
  userRole: IUserRole;
}
