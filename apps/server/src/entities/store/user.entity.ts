import { Column, Entity, OneToMany } from 'typeorm';
import { BaseCreatedUpdated } from '../base/base-created-updated.entity';
import { UserUserRole } from './user-user-role.entity';

@Entity()
export class User extends BaseCreatedUpdated {
  @Column({ nullable: false, type: 'character varying', length: 250 })
  name: string;

  @Column({
    nullable: false,
    unique: true,
    type: 'character varying',
    length: 250,
  })
  email: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, type: 'character varying', length: 10 })
  phoneNumber?: string;

  @Column({ nullable: true, type: 'character varying' })
  googleId?: string;

  @Column({ nullable: true, type: 'character varying' })
  passwordHash?: string;

  @OneToMany(() => UserUserRole, (userUserRole) => userUserRole.user)
  userUserRoles?: UserUserRole[];
}
