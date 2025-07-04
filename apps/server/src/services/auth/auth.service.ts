import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IRegisterUserDto } from '@repo/dto';
import { LOCALIZATION } from 'src/common/constants';
import { Converter } from 'src/core/utility/converter';
import { UserService } from 'src/services/auth/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(registerUserDto: IRegisterUserDto) {
    const userExist = await this._userService.findByEmail(
      registerUserDto.email,
    );
    if (userExist)
      throw new ConflictException(
        Converter.stringFormat(LOCALIZATION.userAlreadyExists),
      );
    const user = await this._userService.register(registerUserDto);
    const tokens = this.generateTokens(user.id);
    await this._userService.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      user,
      accessToken: tokens.accessToken,
    };
  }

  generateTokens(userId: number) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  generateAccessToken(userId: number): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m',
      },
    );
  }

  generateRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '2d',
      },
    );
  }
}
