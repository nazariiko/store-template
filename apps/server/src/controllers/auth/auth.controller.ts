import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRegisterUserDto } from '@repo/dto';
import { AuthService } from 'src/services/auth/auth.service';
import { Request, Response } from 'express';
import { TIME_15_MINS, TIME_2_DAYS } from 'src/common/constants';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() request: Request) {
    return {
      user: (request as any).user,
    };
  }

  @Post('signup')
  async register(
    @Body() registerUserDto: IRegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken } =
      await this._authService.registerUser(registerUserDto);
    const isProd = this.configService.get('NODE_ENV') === 'production';

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: TIME_15_MINS,
    });

    return {
      ok: true,
      userId: user.id,
    };
  }
}
