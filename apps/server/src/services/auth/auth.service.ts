import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ILoginUserByGoogleDto,
  ILoginUserDto,
  IRegisterUserByGoogleDto,
  IRegisterUserDto,
} from '@repo/dto';
import { LOCALIZATION } from 'src/common/constants';
import { Converter } from 'src/core/utility/converter';
import { User } from 'src/entities/store/user.entity';
import { UserService } from 'src/services/auth/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUserByGoogle(registerUserDto: IRegisterUserByGoogleDto) {
    const { email, googleId } = registerUserDto;
    const userExist = await this._userService.findByEmail(email);

    if (userExist && userExist.googleId) {
      return {
        user: null,
        message: 'user_exists',
      };
    }

    if (userExist && !userExist.googleId) {
      userExist.googleId = googleId;
      await this._userService.update(userExist);
      const tokens = this.generateTokens(userExist.id);
      await this._userService.updateRefreshToken(
        userExist.id,
        tokens.refreshToken,
      );
      return {
        user: userExist,
        accessToken: tokens.accessToken,
      };
    }

    const user = await this._userService.registerByGoogle(registerUserDto);
    const tokens = this.generateTokens(user.id);
    await this._userService.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      user,
      accessToken: tokens.accessToken,
    };
  }

  async loginUserByGoogle(loginUserDto: ILoginUserByGoogleDto) {
    const { email, googleId } = loginUserDto;
    const userExist = await this._userService.findByEmail(email);

    if (!userExist) {
      return {
        user: null,
        message: 'user_not_exists',
      };
    }

    if (userExist && !userExist.googleId) {
      userExist.googleId = googleId;
      await this._userService.update(userExist);
      const tokens = this.generateTokens(userExist.id);
      await this._userService.updateRefreshToken(
        userExist.id,
        tokens.refreshToken,
      );
      return {
        user: userExist,
        accessToken: tokens.accessToken,
      };
    }

    const tokens = this.generateTokens(userExist.id);
    await this._userService.updateRefreshToken(
      userExist.id,
      tokens.refreshToken,
    );
    return {
      user: userExist,
      accessToken: tokens.accessToken,
    };
  }

  async loginUser(loginUserDto: ILoginUserDto) {
    const { email, password } = loginUserDto;
    const userExist = await this._userService.findByEmail(email);
    if (!userExist)
      throw new NotFoundException(
        Converter.stringFormat(LOCALIZATION.userNotExists),
      );

    const isPasswordValid = await this._userService.comparePasswords(
      password,
      userExist.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        Converter.stringFormat(LOCALIZATION.passwordsNotMatches),
      );
    }

    const tokens = this.generateTokens(userExist.id);
    await this._userService.updateRefreshToken(
      userExist.id,
      tokens.refreshToken,
    );
    return {
      user: userExist,
      accessToken: tokens.accessToken,
    };
  }

  async registerUser(registerUserDto: IRegisterUserDto): Promise<{
    user: User;
    accessToken: string;
  }> {
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
