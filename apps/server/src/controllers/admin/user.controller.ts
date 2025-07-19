import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IGetMeResponse, IGetUsersListFilters } from '@repo/dto';
import { Request } from 'express';
import { DEFAULT_PAGE_LIMIT } from 'src/common/constants';
import { DataPageResponse } from 'src/core/interfaces/data-page-response';
import { User } from 'src/entities/store/user.entity';
import { AdminAuthGuard } from 'src/guards/auth-admin.guard';
import { UserService } from 'src/services/auth/user.service';
import { DataSource, FindOptionsWhere, ILike, In } from 'typeorm';

@Controller('admin/user')
export class AdminUserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _dataSource: DataSource,
  ) {}

  @UseGuards(AdminAuthGuard)
  @Post('list')
  @HttpCode(200)
  async getList(
    @Req() request: Request,
    @Body('filters')
    filters: IGetUsersListFilters,
    @Body('pageNumber') pageNumber: number,
    @Body('limit') limit: number,
  ) {
    limit = limit ?? DEFAULT_PAGE_LIMIT;
    pageNumber = pageNumber ?? 1;

    const where: FindOptionsWhere<User> = {};

    if (filters.name) {
      where.name = ILike(`%${filters.name}%`);
    }
    if (filters.email) {
      where.email = ILike(`%${filters.email}%`);
    }
    if (filters.phoneNumber) {
      where.phoneNumber = ILike(`%${filters.phoneNumber}%`);
    }
    if (filters.userRoleIds?.length) {
      where.userUserRoles = {
        userRole: {
          id: In(filters.userRoleIds),
        },
      };
    }

    const users = await this._userService.findByOptions({
      where: where,
      relations: { userUserRoles: { userRole: true } },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isEmailVerified: true,
        createdDate: true,
        userUserRoles: {
          id: true,
          userRole: {
            id: true,
            uaName: true,
          },
        },
      },
      order: { createdDate: 'DESC' },
      skip: (pageNumber - 1) * limit,
      take: limit + 1,
    });

    const dataPageResponse = new DataPageResponse(users, limit);
    return dataPageResponse;
  }
}
