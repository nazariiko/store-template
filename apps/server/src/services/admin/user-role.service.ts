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
}
