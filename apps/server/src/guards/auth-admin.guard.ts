// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/auth/user.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly _userService: UserService,
    private readonly _authService: AuthService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];

    // !access && !refresh
    if (!accessToken && !refreshToken) {
      return true;
    }

    // !access && refresh
    if (!accessToken && refreshToken) {
      const decoded = this.jwtService.decode(refreshToken);
      if (!decoded) {
        return true;
      } else {
        const userId = +decoded.sub;
        if (isNaN(userId)) {
          return true;
        }

        const user = await this._userService.getMe(userId);
        if (refreshToken !== user.refreshToken) {
          return true;
        }
        try {
          this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
          });
          (req as any).user = user;
          await this._authService.generateAndSetTokens(user.id, req);
          return true;
        } catch {
          return true;
        }
      }
    }

    // access
    const decoded = this.jwtService.decode(accessToken);
    if (!decoded) {
      return true;
    } else {
      const userId = +decoded.sub;
      if (isNaN(userId)) {
        return true;
      }

      const user = await this._userService.getMe(userId);
      try {
        this.jwtService.verify(accessToken, {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
        });
        (req as any).user = user;
        await this._authService.generateAndSetTokens(user.id, req);
        return true;
      } catch {
        const refreshToken = user.refreshToken;
        if (!refreshToken) {
          return true;
        } else {
          try {
            this.jwtService.verify(refreshToken, {
              secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            (req as any).user = user;
            await this._authService.generateAndSetTokens(user.id, req);
            return true;
          } catch (error) {
            return true;
          }
        }
      }
    }
  }
}
