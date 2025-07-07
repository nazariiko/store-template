import { Global, Module } from '@nestjs/common';
import { UserWatcherService } from 'src/services/watchers/user.watcher';

const services = [UserWatcherService];

@Global()
@Module({
  providers: services,
  exports: services,
})
export class WatcherModule {}
