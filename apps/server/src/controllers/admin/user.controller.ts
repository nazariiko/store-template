import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  commonErrorMessages,
  IGetMeResponse,
  IGetUserResponse,
  IGetUsersListFilters,
  UserRight,
} from '@repo/dto';
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
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const item = await this._userService.findOneByOptions({
      where: { id: id },
      relations: { userUserRoles: { userRole: true } },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isEmailVerified: true,
        userUserRoles: {
          id: true,
          userRole: {
            id: true,
            uaName: true,
            alias: true,
            rank: true,
          },
        },
      },
    });
    if (!item) {
      return {
        ok: false,
        message: commonErrorMessages.user_not_exists,
      };
    }

    const user: IGetMeResponse = (request as any).user;
    const userRank = this._userService.getUserRoleRank(user);
    const itemRank = this._userService.getUserRoleRank(item);

    const responseUser: IGetUserResponse = {
      ...item,
      deletable:
        user.rights.includes(UserRight.USER_DELETE) && userRank < itemRank,
      editable:
        user.rights.includes(UserRight.USER_EDIT) && userRank < itemRank,
    };

    return {
      ok: true,
      data: {
        user: responseUser,
      },
    };
  }

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
