import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ILoginUserDto,
  IRegisterUserDto,
  TIME_15_MINS,
  TIME_2_DAYS,
} from '@repo/dto';
import { AuthService } from 'src/services/auth/auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/entities/store/user.entity';
import { UserRoleUserRightService } from 'src/services/admin/user-role-user-right.service';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { GoogleRegisterAuthGuard } from 'src/guards/auth-register-google.guard';
import { GoogleLoginAuthGuard } from 'src/guards/auth-login-google.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userRoleUserRight: UserRoleUserRightService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() request: Request) {
    const user: User = (request as any).user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const userRoles = user.userUserRoles.map((userUserRole) => {
      return userUserRole.userRole;
    });
    const rights =
      await this._userRoleUserRight.getUserRightsByRoles(userRoles);
    return {
      user: {
        ...(request as any).user,
        rights,
      },
    };
  }

  @Get('google/login')
  @UseGuards(GoogleLoginAuthGuard)
  async googleAuth() {}

  @Get('google/register')
  @UseGuards(GoogleRegisterAuthGuard)
  async googleLogin() {}

  @Get('google/redirect')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuthRedirect(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Query('state') state: string,
  ) {
    const json: string = Buffer.from(state, 'base64').toString('utf-8');
    const { returnUrl, type } = JSON.parse(json);
    const { email, name, googleId } = request.user as any;

    let user: User, accessToken: string, refreshToken: string, message: string;
    if (type === 'register') {
      ({ user, accessToken, refreshToken, message } =
        await this._authService.registerUserByGoogle({
          name: name,
          email: email,
          googleId: googleId,
        }));
    } else if (type === 'login') {
      ({ user, accessToken, refreshToken, message } =
        await this._authService.loginUserByGoogle({
          name: name,
          email: email,
          googleId: googleId,
        }));
    }

    if (!user) {
      return response.redirect(
        `${this.configService.get('BASE_CLIENT_URL')}${returnUrl}?auth=failed&message=${message}`,
      );
    }
    const isProd = this.configService.get('NODE_ENV') === 'production';

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_15_MINS,
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_2_DAYS,
    });

    response.redirect(
      `${this.configService.get('BASE_CLIENT_URL')}${returnUrl}`,
    );
  }

  @Post('signin')
  async login(
    @Body() loginUserDto: ILoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this._authService.loginUser(loginUserDto);
    const isProd = this.configService.get('NODE_ENV') === 'production';

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_15_MINS,
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_2_DAYS,
    });

    return {
      ok: true,
      userId: user.id,
    };
  }

  @Post('signup')
  async register(
    @Body() registerUserDto: IRegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this._authService.registerUser(registerUserDto);
    const isProd = this.configService.get('NODE_ENV') === 'production';

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_15_MINS,
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_2_DAYS,
    });

    return {
      ok: true,
      userId: user.id,
    };
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return response.sendStatus(200);
  }
}
