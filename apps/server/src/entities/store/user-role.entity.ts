import { Column, Entity, OneToMany } from 'typeorm';
import { BaseCreatedUpdated } from '../base/base-created-updated.entity';
import { UserUserRole } from './user-user-role.entity';
import { UserRoleUserRight } from './user-role-user-right.entity';

@Entity()
export class UserRole extends BaseCreatedUpdated {
  @Column({ nullable: false, type: 'character varying', length: 50 })
  name: string;

  @Column({ nullable: false, type: 'character varying', length: 50 })
  uaName: string;

  @Column({ nullable: false, type: 'character varying', length: 50 })
  alias: string;

  @Column({ nullable: false })
  rank: number;

  @OneToMany(() => UserUserRole, (userUserRole) => userUserRole.userRole)
  userUserRoles?: UserUserRole[];

  @OneToMany(
    () => UserRoleUserRight,
    (userRoleUserRight) => userRoleUserRight.userRole,
  )
  userRoleUserRights?: UserRoleUserRight[];
}
