import { Column } from 'typeorm';
import { ICreatedUpdated } from '../../models/interfaces/created-updated';
import { BaseModel } from './base-model.entity';

export abstract class BaseCreatedUpdated
  extends BaseModel
  implements ICreatedUpdated
{
  @Column({ nullable: true })
  createdByUserId?: number;

  @Column({ nullable: true, type: 'timestamptz' })
  createdDate?: Date;

  @Column({ nullable: true })
  updatedByUserId?: number;

  @Column({ nullable: true, type: 'timestamptz' })
  updatedDate?: Date;
}
