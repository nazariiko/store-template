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
  ICreateUserRoleDto,
  IGetMeResponse,
  IUpdateUserRoleDto,
  UserRight,
  UserRoleId,
  UserRoleRanks,
} from '@repo/dto';
import { Permissions } from 'src/decorators/permissions.decorator';
import { UserRoleUserRight } from 'src/entities/store/user-role-user-right.entity';
import { UserRole } from 'src/entities/store/user-role.entity';
import { UserUserRole } from 'src/entities/store/user-user-role.entity';
import { AdminAuthGuard } from 'src/guards/auth-admin.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { UserRoleUserRightService } from 'src/services/admin/user-role-user-right.service';
import { UserRoleService } from 'src/services/admin/user-role.service';
import { UserUserRoleService } from 'src/services/admin/user-user-role.service';
import { UserService } from 'src/services/auth/user.service';

@Controller('admin/user-role')
export class AdminUserRoleController {
  constructor(
    private readonly _userRoleService: UserRoleService,
    private readonly _userService: UserService,
    private readonly _userRoleUserRightService: UserRoleUserRightService,
  ) {}

  @UseGuards(AdminAuthGuard)
  @Get('list-with-is-editable')
  async getListWithIsEditable(@Req() request: Request) {
    const user: IGetMeResponse = (request as any).user;
    const userRank = this._userService.getUserRoleRank(user);
    const userRoles = await this._userRoleService.findByOptions({
      relations: { userRoleUserRights: { userRight: true } },
      select: {
        id: true,
        name: true,
        uaName: true,
        alias: true,
        rank: true,
        userRoleUserRights: {
          id: true,
          userRight: {
            id: true,
            uaName: true,
            uaDescription: true,
          },
        },
      },
    });

    const userRolesWithIsEditable = userRoles.map((userRole) => {
      const isEditable =
        user.rights.includes(UserRight.ROLE_RIGHTS_CHANGE) &&
        userRole.id !== UserRoleId.Client &&
        userRank < userRole.rank;

      return {
        ...userRole,
        isEditable: isEditable,
      };
    });

    return userRolesWithIsEditable;
  }

  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @Permissions('role_rights_change')
  @Post()
  @HttpCode(200)
  async create(@Req() request: Request, @Body() body: ICreateUserRoleDto) {
    const user: IGetMeResponse = (request as any).user;
    const userRank = this._userService.getUserRoleRank(user);

    const { name, alias, uaName, rank, userRightIds } = body;
    const roleExists = await this._userRoleService.checkExistence(
      name,
      alias,
      uaName,
    );

    if (roleExists) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_exists,
      };
    }

    if (!rank || rank <= userRank || rank >= UserRoleRanks.Client) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_rank_error,
      };
    }

    const userRoleModel: UserRole = {
      id: undefined,
      name: name,
      uaName: uaName,
      alias: alias,
      rank: rank,
      ...this._userRoleService.getCreatedUpdated(user.id),
    };
    const newUserRoleItem = await this._userRoleService.create(userRoleModel);

    for (const userRightId of userRightIds) {
      const userRoleUserRightModel: UserRoleUserRight = {
        id: undefined,
        userRoleId: newUserRoleItem.id,
        userRightId: userRightId,
        ...this._userRoleUserRightService.getCreatedUpdated(user.id),
      };
      await this._userRoleUserRightService.create(userRoleUserRightModel);
    }

    return {
      ok: true,
      message: commonSuccessMessages.user_role_created,
      data: {
        userRole: newUserRoleItem,
      },
    };
  }

  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @Permissions('role_rights_change')
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @Body() body: IUpdateUserRoleDto,
  ) {
    const item = await this._userRoleService.getById(id);
    if (!item) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_not_exists,
      };
    }

    const user: IGetMeResponse = (request as any).user;
    const userRank = this._userService.getUserRoleRank(user);

    const { name, alias, uaName, rank } = body;

    if (item.rank <= userRank) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_rank_error,
      };
    }

    if (!rank || rank <= userRank || rank >= UserRoleRanks.Client) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_rank_error,
      };
    }

    item.alias = alias;
    item.name = name;
    item.uaName = uaName;
    item.rank = rank;
    item.updatedDate = new Date();
    item.updatedByUserId = user.id;

    await this._userRoleService.update(item);
    return {
      ok: true,
      message: commonSuccessMessages.user_role_updated,
    };
  }

  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @Permissions('role_rights_change')
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const item = await this._userRoleService.getById(id);
    if (!item) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_not_exists,
      };
    }

    const user: IGetMeResponse = (request as any).user;
    const userRank = this._userService.getUserRoleRank(user);

    if (item.rank <= userRank) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_rank_error,
      };
    }

    if (item.id === UserRoleId.Client) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_client_cannot_delete,
      };
    }

    await this._userRoleService.removeById(id);
    return {
      ok: true,
      message: commonSuccessMessages.user_role_deleted,
    };
  }
}
