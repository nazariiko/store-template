import { SetMetadata, applyDecorators } from '@nestjs/common';

export const Permissions = (...permissions: string[]) => {
  return applyDecorators(SetMetadata('requiredPermissions', permissions));
};
