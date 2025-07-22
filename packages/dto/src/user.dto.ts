import { IBaseCreatedUpdated } from './base/base-created-updated.model';
import { IUserUserRole } from './user-user-role.dto';

export interface IUser extends IBaseCreatedUpdated {
  name: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  googleId?: string;
  passwordHash?: string;
  userUserRoles?: IUserUserRole[];
}

export interface IGetUsersListFilters {
  name?: string;
  email?: string;
  phoneNumber?: string;
  userRoleIds?: number[];
}

export interface IGetUsersResponse {
  data: Omit<IUser, 'googleId' | 'passwordHash'>[];
  hasNextPage: boolean;
}

export interface IGetUserResponse {
  name: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  userUserRoles?: IUserUserRole[];
  editable: boolean;
  deletable: boolean;
}
