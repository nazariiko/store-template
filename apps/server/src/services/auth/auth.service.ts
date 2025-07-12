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
  UserRight,
} from '@repo/dto';
import { Request } from 'express';
import { LOCALIZATION } from 'src/common/constants';
import { Converter } from 'src/core/utility/converter';
import { User } from 'src/entities/store/user.entity';
import { UserRoleUserRightService } from 'src/services/admin/user-role-user-right.service';
import { UserService } from 'src/services/auth/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _userRoleUserRight: UserRoleUserRightService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  #accessDeniedMessage = {
    ok: false,
    message: 'admin_panel_access_denied',
    tokens: null,
  };

  async checkAdminAccess(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ) {
    if (!accessToken && !refreshToken) {
      return this.#accessDeniedMessage;
    }

    // !access && refresh
    if (!accessToken && refreshToken) {
      const decoded = this.jwtService.decode(refreshToken);
      if (!decoded) {
        return this.#accessDeniedMessage;
      } else {
        const userId = +decoded.sub;
        if (isNaN(userId)) {
          return this.#accessDeniedMessage;
        }

        const user = await this._userService.getMe(userId);
        if (refreshToken !== user.refreshToken) {
          return this.#accessDeniedMessage;
        }
        try {
          this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
          });
          return this.checkRightsAndGetTokens(user);
        } catch {
          return this.#accessDeniedMessage;
        }
      }
    }

    // access
    const decoded = this.jwtService.decode(accessToken);
    if (!decoded) {
      return this.#accessDeniedMessage;
    } else {
      const userId = +decoded.sub;
      if (isNaN(userId)) {
        return this.#accessDeniedMessage;
      }

      const user = await this._userService.getMe(userId);
      try {
        this.jwtService.verify(accessToken, {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
        });
        return this.checkRightsAndGetTokens(user);
      } catch {
        const refreshToken = user.refreshToken;
        if (!refreshToken) {
          return this.#accessDeniedMessage;
        } else {
          try {
            this.jwtService.verify(refreshToken, {
              secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            return this.checkRightsAndGetTokens(user);
          } catch (error) {
            return this.#accessDeniedMessage;
          }
        }
      }
    }
  }

  async checkRightsAndGetTokens(user: User) {
    const hasAccess = await this.hasAdminAccessByUser(user);
    if (hasAccess) {
      const tokens = this.generateTokens(user.id);
      await this._userService.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        ok: true,
        tokens: tokens,
        message: null,
      };
    } else {
      return this.#accessDeniedMessage;
    }
  }

  async hasAdminAccessByUser(user: User) {
    const userRoles = user.userUserRoles.map((userUserRole) => {
      return userUserRole.userRole;
    });
    const rights =
      await this._userRoleUserRight.getUserRightsByRoles(userRoles);

    return rights.includes(UserRight.ADMIN_PANEL_ACCESS);
  }

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
        refreshToken: tokens.refreshToken,
      };
    }

    const user = await this._userService.registerByGoogle(registerUserDto);
    const tokens = this.generateTokens(user.id);
    await this._userService.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
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
        refreshToken: tokens.refreshToken,
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
      refreshToken: tokens.refreshToken,
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
      refreshToken: tokens.refreshToken,
    };
  }

  async registerUser(registerUserDto: IRegisterUserDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
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
      refreshToken: tokens.refreshToken,
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

  async generateAndSetTokens(userId: number, req: Request) {
    const newTokens = this.generateTokens(userId);
    await this._userService.updateRefreshToken(userId, newTokens.refreshToken);

    (req as any).refreshToken = newTokens.refreshToken;
    (req as any).accessToken = newTokens.accessToken;
  }
}
