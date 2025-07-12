import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthController } from 'src/controllers/admin/admin-auth.controller';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { User } from 'src/entities/store/user.entity';
import { AuthService } from 'src/services/auth/auth.service';
import { GoogleStrategy } from 'src/services/auth/google.strategy';
import { UserService } from 'src/services/auth/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, UserService, GoogleStrategy],
})
export class AuthModule {
  constructor() {}
}
