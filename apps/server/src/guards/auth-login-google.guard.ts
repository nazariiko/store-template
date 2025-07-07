import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleLoginAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const returnUrl = req.query.returnUrl || '/';
    const type = req.query.type;
    const state = Buffer.from(
      JSON.stringify({ returnUrl, type }),
      'utf8',
    ).toString('base64');
    return {
      scope: ['email', 'profile'],
      state,
    };
  }
}
