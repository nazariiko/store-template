import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseCreatedUpdated } from '../base/base-created-updated.entity';
import { UserRole } from './user-role.entity';
import { UserRoleUserRight } from './user-role-user-right.entity';

@Entity()
export class UserRight extends BaseCreatedUpdated {
  @Column({ nullable: false, type: 'character varying', length: 50 })
  alias: string;

  @Column({ nullable: false, type: 'character varying', length: 100 })
  uaName: string;

  @Column({ nullable: false, type: 'character varying', length: 100 })
  enName: string;

  @Column({ nullable: true, type: 'character varying', length: 500 })
  uaDescription?: string;

  @Column({ nullable: true, type: 'character varying', length: 500 })
  enDescription?: string;

  @OneToMany(
    () => UserRoleUserRight,
    (userRoleUserRight) => userRoleUserRight.userRight,
  )
  userRoleUserRights?: UserRoleUserRight[];
}
