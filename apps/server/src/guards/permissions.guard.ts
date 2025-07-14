import { IGetMeResponse } from '@repo/dto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const user = req.user as IGetMeResponse;

    const requiredPermissions = this.reflector.get<string[]>(
      'requiredPermissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    if (!user || !user.rights) {
      throw new UnauthorizedException('You are not authorized');
    }

    const hasPermissions = requiredPermissions.every((permission) =>
      user.rights.includes(permission),
    );

    if (!hasPermissions) {
      throw new ForbiddenException(
        'You do not have permissions to call this request',
      );
    } else {
      return true;
    }
  }
}
