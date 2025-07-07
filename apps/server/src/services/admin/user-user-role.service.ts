import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Repository } from 'typeorm';
import { UserUserRole } from 'src/entities/store/user-user-role.entity';

export class UserUserRoleService extends BaseService<UserUserRole> {
  constructor(
    @InjectRepository(UserUserRole)
    repository: Repository<UserUserRole>,
  ) {
    super(repository);
  }
}
