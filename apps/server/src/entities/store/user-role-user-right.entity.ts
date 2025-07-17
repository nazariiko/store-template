import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseCreatedUpdated } from '../base/base-created-updated.entity';
import { User } from './user.entity';
import { UserRole } from './user-role.entity';
import { UserRight } from './user-right.entity';

@Entity()
@Unique(['userRoleId', 'userRightId'])
export class UserRoleUserRight extends BaseCreatedUpdated {
  @Column({ nullable: false })
  userRoleId: number;

  @Column({ nullable: false })
  userRightId: number;

  @ManyToOne(() => UserRole, (userRole) => userRole.userRoleUserRights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userRoleId' })
  userRole?: UserRole;

  @ManyToOne(() => UserRight, (userRight) => userRight.userRoleUserRights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userRightId' })
  userRight?: UserRight;
}
