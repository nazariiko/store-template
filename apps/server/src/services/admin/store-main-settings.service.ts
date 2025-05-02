import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Repository } from 'typeorm';
import { StoreMainSettings } from '../../entities/admin/store-main-settings.entity';

export class StoreMainSettingsService extends BaseService<StoreMainSettings> {
  constructor(
    @InjectRepository(StoreMainSettings)
    repository: Repository<StoreMainSettings>,
  ) {
    super(repository);
  }
}
