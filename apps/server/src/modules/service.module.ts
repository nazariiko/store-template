import { Global, Module } from '@nestjs/common';

const storeServices = [];
const adminServices = [];

const services = [...storeServices, ...adminServices];

@Global()
@Module({
  imports: [],
  providers: services,
  exports: services,
})
export class ServiceModule {}
