import { IBaseCreatedUpdated } from './base/base-created-updated.model';

export interface IUserRole extends IBaseCreatedUpdated {
  name: string;
  alias: string;
  uaName: string;
  rank: number;
}

export interface ICreateUserRoleDto {
  name: string;
  alias: string;
  uaName: string;
  rank: number;
}

export interface IUpdateUserRoleDto {
  name: string;
  alias: string;
  uaName: string;
  rank: number;
}
