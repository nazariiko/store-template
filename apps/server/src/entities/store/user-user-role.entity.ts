import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseCreatedUpdated } from '../base/base-created-updated.entity';
import { User } from './user.entity';
import { UserRole } from './user-role.entity';

@Entity()
@Unique(['userId', 'userRoleId'])
export class UserUserRole extends BaseCreatedUpdated {
  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  userRoleId: number;

  @ManyToOne(() => User, (user) => user.userUserRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => UserRole, (role) => role.userUserRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userRoleId' })
  userRole?: UserRole;
}
