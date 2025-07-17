import { IBaseCreatedUpdated } from './base/base-created-updated.model';
import { IBase } from './base/base.model';
import { IUserRoleUserRight } from './user-right.dto';

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
  userRightIds: number[];
}

export interface IUpdateUserRoleDto {
  name: string;
  alias: string;
  uaName: string;
  rank: number;
}

export interface IGetUserRolesWithIsEditableResponse extends IBase {
  name: string;
  alias: string;
  uaName: string;
  rank: number;
  isEditable: boolean;
  userRoleUserRights: IUserRoleUserRight[];
}
