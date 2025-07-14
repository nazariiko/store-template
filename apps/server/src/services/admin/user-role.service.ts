import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Repository } from 'typeorm';
import { UserRole } from 'src/entities/store/user-role.entity';

export class UserRoleService extends BaseService<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    repository: Repository<UserRole>,
  ) {
    super(repository);
  }

  async checkExistence(name: string, alias: string, uaName: string) {
    const userRole = await this.findOneByOptions({
      where: [{ name: name }, { alias: alias }, { uaName: uaName }],
    });

    return Boolean(userRole);
  }
}
