import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  DataSource,
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from 'src/entities/store/user.entity';
import { UserUserRoleService } from 'src/services/admin/user-user-role.service';
import { UserUserRole } from 'src/entities/store/user-user-role.entity';
import { UserRoleId } from 'src/common/enums/user-role';
import { ROOT_USER_ID } from 'src/common/constants';

@EventSubscriber()
export class UserWatcherService implements EntitySubscriberInterface<User> {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly _logger: LoggerService;

  constructor(
    dataSource: DataSource,
    private readonly _userUserRoleService: UserUserRoleService,
  ) {
    dataSource.subscribers.push(this);
  }

  public listenTo(): Function {
    return User;
  }

  public async afterInsert(event: InsertEvent<User>): Promise<void> {
    try {
      const user = event.entity;
      await event.manager
        .getRepository(UserUserRole)
        .insert({
          userId: user.id,
          userRoleId: UserRoleId.Client,
          ...this._userUserRoleService.getCreatedUpdated(ROOT_USER_ID),
        });
    } catch (error) {
      this._logger.error(error);
    }
  }
}
