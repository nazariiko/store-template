import { Module } from '@nestjs/common';

const storeControllers = [];

const adminControllers = [];

@Module({
  controllers: [...storeControllers, ...adminControllers],
  providers: [],
})
export class ControllerModule {}
