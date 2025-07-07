// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TIME_15_MINS, TIME_2_DAYS } from 'src/common/constants';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/auth/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
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

    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }

    const decoded = this.jwtService.decode(accessToken);
    if (!decoded) {
      throw new UnauthorizedException('Access token is not valid');
    } else {
      const userId = +decoded.sub;
      if (isNaN(userId)) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this._userService.findOneByOptions({
        where: { id: userId },
        relations: { userUserRoles: { userRole: true } },
        select: {
          id: true,
          name: true,
          email: true,
          isEmailVerified: true,
          phoneNumber: true,
          refreshToken: true,
          userUserRoles: {
            id: true,
            userRole: {
              id: true,
              name: true,
              alias: true,
            },
          },
        },
      });
      try {
        this.jwtService.verify(accessToken, {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
        });
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
            (req as any).user = user;
            const newTokens = this._authService.generateTokens(userId);
            await this._userService.updateRefreshToken(
              userId,
              newTokens.refreshToken,
            );

            const isProd = this.configService.get('NODE_ENV') === 'production';
            res.cookie('access_token', newTokens.accessToken, {
              httpOnly: true,
              secure: isProd,
              sameSite: 'strict',
              maxAge: TIME_15_MINS,
            });
            return true;
          } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Refresh token expired.');
          }
        }
      }
    }
  }
}
