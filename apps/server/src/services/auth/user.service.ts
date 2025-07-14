import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Repository } from 'typeorm';
import { User } from 'src/entities/store/user.entity';
import {
  IGetMeResponse,
  IRegisterUserByGoogleDto,
  IRegisterUserDto,
  ROOT_USER_ID,
  UserRoleRanks,
} from '@repo/dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LOCALIZATION } from 'src/common/constants';
import { NotFoundByIdException } from 'src/core/exception/not-found-by-id.exception';
import { Converter } from 'src/core/utility/converter';
import { UserRoleUserRightService } from 'src/services/admin/user-role-user-right.service';

export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    private _userRoleUserRightService: UserRoleUserRightService,
    private configService: ConfigService,
  ) {
    super(repository);
  }

  async registerByGoogle(
    registerUserDto: IRegisterUserByGoogleDto,
  ): Promise<User> {
    const { email, name, googleId } = registerUserDto;
    const userModel: User = {
      id: undefined,
      passwordHash: null,
      isEmailVerified: false,
      refreshToken: null,
      name: name,
      email: email,
      googleId: googleId,
      ...this.getCreatedUpdated(ROOT_USER_ID),
    };
    return await this.create(userModel);
  }

  async register(registerUserDto: IRegisterUserDto): Promise<User> {
    const { password, ...user } = registerUserDto;
    const saltRounds = this.configService.get<string>('SALT_ROUNDS') as string;
    const hash = await bcrypt.hash(password, +saltRounds);
    const userModel: User = {
      id: undefined,
      passwordHash: hash,
      isEmailVerified: false,
      refreshToken: null,
      ...user,
      ...this.getCreatedUpdated(ROOT_USER_ID),
    };
    return await this.create(userModel);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundByIdException(
        User,
        userId,
        Converter.stringFormat(LOCALIZATION.userNotFoundById, userId),
      );
    }
    user.refreshToken = refreshToken;
    await this.update(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.findOneByOptions({
      where: {
        email: email,
      },
    });
    return user;
  }

  async getMe(userId: number): Promise<IGetMeResponse> {
    const user = await this.findOneByOptions({
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
            rank: true,
            uaName: true,
          },
        },
      },
    });

    const userRoles = user.userUserRoles.map((userUserRole) => {
      return userUserRole.userRole;
    });
    const rights =
      await this._userRoleUserRightService.getUserRightsByRoles(userRoles);

    return {
      ...user,
      rights: rights,
    };
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hash);
    return isPasswordValid;
  }

  getUserRoleRank(user: IGetMeResponse): number {
    const ranks = user.userUserRoles.map((userUserRole) => {
      return userUserRole.userRole.rank;
    });
    if (!ranks.length) {
      return UserRoleRanks.Client;
    } else {
      return Math.min(...ranks);
    }
  }
}
