import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly _authService: AuthService) {}

  @Get('check-access')
  async checkAccess(@Req() request: Request) {
    const authHeader = request.headers['authorization'];
    const refreshToken: string | undefined = request.cookies['refresh_token'];

    let accessToken: string | undefined;
    if (authHeader) {
      accessToken = authHeader.split(' ')[1];
    }
    const { ok, tokens, message } = await this._authService.checkAdminAccess(
      accessToken,
      refreshToken,
    );

    return {
      ok,
      message,
      tokens,
    };
  }
}
