import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Repository } from 'typeorm';
import { User } from 'src/entities/store/user.entity';
import { IRegisterUserByGoogleDto, IRegisterUserDto } from '@repo/dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LOCALIZATION, ROOT_USER_ID } from 'src/common/constants';
import { NotFoundByIdException } from 'src/core/exception/not-found-by-id.exception';
import { Converter } from 'src/core/utility/converter';

export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
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

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hash);
    return isPasswordValid;
  }
}
