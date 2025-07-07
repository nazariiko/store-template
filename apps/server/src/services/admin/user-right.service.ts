import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Repository } from 'typeorm';
import { UserRight } from 'src/entities/store/user-right.entity';

export class UserRightService extends BaseService<UserRight> {
  constructor(
    @InjectRepository(UserRight)
    repository: Repository<UserRight>,
  ) {
    super(repository);
  }
}
