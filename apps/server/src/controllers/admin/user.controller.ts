import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  commonErrorMessages,
  commonSuccessMessages,
  IGetMeResponse,
  IGetUserResponse,
  IGetUsersListFilters,
  IUpdateUserDto,
  UserRight,
} from '@repo/dto';
import { Request } from 'express';
import { DEFAULT_PAGE_LIMIT } from 'src/common/constants';
import { DataPageResponse } from 'src/core/interfaces/data-page-response';
import { Permissions } from 'src/decorators/permissions.decorator';
import { UserUserRole } from 'src/entities/store/user-user-role.entity';
import { User } from 'src/entities/store/user.entity';
import { AdminAuthGuard } from 'src/guards/auth-admin.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { UserRoleService } from 'src/services/admin/user-role.service';
import { UserService } from 'src/services/auth/user.service';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  ILike,
  In,
} from 'typeorm';

@Controller('admin/user')
export class AdminUserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _userRoleService: UserRoleService,
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

  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @Permissions(UserRight.USER_EDIT)
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @Body() body: IUpdateUserDto,
  ) {
    const user: IGetMeResponse = (request as any).user;
    const item = await this._userService.findOneByOptions({
      where: { id: id },
      relations: { userUserRoles: { userRole: true } },
      select: {
        id: true,
        userUserRoles: {
          id: true,
          userRoleId: true,
          userRole: {
            id: true,
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

    const responseStatus = { ok: true, message: '' };
    const userRank = this._userService.getUserRoleRank(user);
    const userUserRoles = item.userUserRoles;
    const userUserRolesToDelete: UserUserRole[] = [];
    const userRolesIdsToCreate: number[] = [];

    for (const userRoleId of body.userRoleIds) {
      const userRole = await this._userRoleService.findOneByOptions({
        where: { id: userRoleId },
      });
      if (!userRole) {
        responseStatus.ok = false;
        responseStatus.message = commonErrorMessages.user_role_not_exists;
        break;
      }
      const exists = Boolean(
        userUserRoles.find(
          (userUserRole) => userUserRole.userRoleId === userRole.id,
        ),
      );
      if (!exists) {
        if (userRole.rank > userRank) {
          userRolesIdsToCreate.push(userRoleId);
        } else {
          responseStatus.ok = false;
          responseStatus.message = commonErrorMessages.user_role_rank_error;
          break;
        }
      }
    }

    for (const userUserRole of userUserRoles) {
      if (!body.userRoleIds.includes(userUserRole.userRoleId)) {
        if (userUserRole.userRole.rank > userRank) {
          userUserRolesToDelete.push(userUserRole);
        } else {
          responseStatus.ok = false;
          responseStatus.message = commonErrorMessages.user_role_rank_error;
          break;
        }
      }
    }

    if (!responseStatus.ok) {
      return responseStatus;
    }

    return await this._dataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager
          .getRepository(UserUserRole)
          .remove(userUserRolesToDelete);

        for (const userRoleIdToCreate of userRolesIdsToCreate) {
          const userUserRoleModel: UserUserRole = {
            id: undefined,
            userId: id,
            userRoleId: userRoleIdToCreate,
            userRole: undefined,
            ...this._userRoleService.getCreatedUpdated(user.id),
          };
          await entityManager
            .getRepository(UserUserRole)
            .save(userUserRoleModel);
        }

        const updatedUser = await entityManager.getRepository(User).findOneBy({
          id: id,
        });

        updatedUser.name = body.name;
        updatedUser.phoneNumber = body.phone ?? null;
        updatedUser.updatedDate = new Date();
        updatedUser.updatedByUserId = user.id;
        await entityManager.getRepository(User).save(updatedUser);
        return {
          ok: true,
          message: commonSuccessMessages.user_updated,
        };
      },
    );
  }

  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @Permissions(UserRight.USER_DELETE)
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const item = await this._userService.getById(id);

    if (!item) {
      return {
        ok: false,
        message: commonErrorMessages.user_not_exists,
      };
    }

    await this._userService.removeById(id);
    return {
      ok: true,
      message: commonSuccessMessages.user_deleted,
    };
  }
}
