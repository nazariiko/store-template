import { IUpdated } from './updated';

export interface ICreatedUpdated extends IUpdated {
  createdDate?: Date;
  createdByUserId?: number;
}
