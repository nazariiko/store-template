import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Repository } from 'typeorm';
import { UserRoleUserRight } from 'src/entities/store/user-role-user-right.entity';
import { UserRole } from 'src/entities/store/user-role.entity';

export class UserRoleUserRightService extends BaseService<UserRoleUserRight> {
  constructor(
    @InjectRepository(UserRoleUserRight)
    repository: Repository<UserRoleUserRight>,
  ) {
    super(repository);
  }

  async getUserRightsByRoles(roles: UserRole[]): Promise<string[]> {
    const userRights = [];
    for (const role of roles) {
      const roleRights = await this.findByOptions({
        where: { userRoleId: role.id },
        relations: { userRight: true },
        select: {
          id: true,
          userRight: {
            id: true,
            alias: true,
          },
        },
      });
      for (const roleRight of roleRights) {
        userRights.push(roleRight.userRight.alias);
      }
    }

    return userRights;
  }
}
