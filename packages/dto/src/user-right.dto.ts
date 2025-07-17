import { IBase } from './base/base.model';

export interface IUserRight extends IBase {
  alias: string;
  uaName: string;
  enName: string;
  uaDescription?: string;
  enDescription?: string;
}

export interface IUserRoleUserRight extends IBase {
  userRight: Omit<IUserRight, 'alias'>;
}

export interface IGetUserRightsResponse extends IBase {
  uaName: string;
}
