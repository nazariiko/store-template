import { IBase } from './base.model';

export interface IBaseCreatedUpdated extends IBase {
  createdByUserId?: number;
  createdDate?: Date;
  updatedByUserId?: number;
  updatedDate?: Date;
}
