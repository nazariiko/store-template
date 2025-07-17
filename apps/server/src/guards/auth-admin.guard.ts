// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TIME_15_MINS, TIME_2_DAYS, UserRight } from '@repo/dto';
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
    const shouldUpdateTokens = req.cookies['should_update_tokens'];

    // !access && !refresh
    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No access and refresh tokens provided');
    }

    // !access && refresh
    if (!accessToken && refreshToken) {
      const decoded = this.jwtService.decode(refreshToken);
      if (!decoded) {
        throw new UnauthorizedException('Refresh token is not valid');
      } else {
        const userId = +decoded.sub;
        if (isNaN(userId)) {
          throw new UnauthorizedException('Invalid token payload');
        }

        const user = await this._userService.getMe(userId);
        if (refreshToken !== user.refreshToken) {
          throw new UnauthorizedException('Refresh token is not valid');
        }
        try {
          this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
          });
          const hasAdminAccess = user.rights.includes(
            UserRight.ADMIN_PANEL_ACCESS,
          );
          if (!hasAdminAccess) {
            throw new UnauthorizedException(
              `You don't have permission to access admin requests`,
            );
          }
          (req as any).user = user;
          shouldUpdateTokens === 'false'
            ? ''
            : await this.generateAndSetTokens(user.id, res);
          return true;
        } catch {
          throw new UnauthorizedException('Refresh token expired');
        }
      }
    }

    // access
    const decoded = this.jwtService.decode(accessToken);
    if (!decoded) {
      throw new UnauthorizedException('Access token is not valid');
    } else {
      const userId = +decoded.sub;
      if (isNaN(userId)) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this._userService.getMe(userId);
      try {
        this.jwtService.verify(accessToken, {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
        });
        const hasAdminAccess = user.rights.includes(
          UserRight.ADMIN_PANEL_ACCESS,
        );
        if (!hasAdminAccess) {
          throw new UnauthorizedException(
            `You don't have permission to access admin requests`,
          );
        }
        (req as any).user = user;
        return true;
      } catch {
        const refreshToken = user.refreshToken;
        if (!refreshToken) {
          throw new UnauthorizedException(
            'Access token expired. No refresh token provided',
          );
        } else {
          try {
            this.jwtService.verify(refreshToken, {
              secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const hasAdminAccess = user.rights.includes(
              UserRight.ADMIN_PANEL_ACCESS,
            );
            if (!hasAdminAccess) {
              throw new UnauthorizedException(
                `You don't have permission to access admin requests`,
              );
            }
            (req as any).user = user;
            shouldUpdateTokens === 'false'
              ? ''
              : await this.generateAndSetTokens(user.id, res);
            return true;
          } catch (error) {
            throw new UnauthorizedException('Refresh token expired.');
          }
        }
      }
    }
  }

  private async generateAndSetTokens(userId: number, res: Response) {
    const newTokens = this._authService.generateTokens(userId);
    await this._userService.updateRefreshToken(userId, newTokens.refreshToken);

    const isProd = this.configService.get('NODE_ENV') === 'production';
    res.cookie('access_token', newTokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_15_MINS,
    });

    res.cookie('refresh_token', newTokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_2_DAYS,
    });
  }
}
