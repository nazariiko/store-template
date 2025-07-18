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
import { UserService } from 'src/services/auth/user.service';
import { DataSource, EntityManager, In } from 'typeorm';

@Controller('admin/user-role')
export class AdminUserRoleController {
  constructor(
    private readonly _userRoleService: UserRoleService,
    private readonly _userService: UserService,
    private readonly _userRoleUserRightService: UserRoleUserRightService,
    private readonly _dataSource: DataSource,
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

    return await this._dataSource.transaction(
      async (entityManager: EntityManager) => {
        const userRoleModel: UserRole = {
          id: undefined,
          name: name,
          uaName: uaName,
          alias: alias,
          rank: rank,
          ...this._userRoleService.getCreatedUpdated(user.id),
        };
        const newUserRoleItem = await entityManager
          .getRepository(UserRole)
          .save(userRoleModel);
        const userRoleUserRights = [];
        for (const userRightId of userRightIds) {
          const userRoleUserRightModel: UserRoleUserRight = {
            id: undefined,
            userRoleId: newUserRoleItem.id,
            userRightId: userRightId,
            ...this._userRoleUserRightService.getCreatedUpdated(user.id),
          };
          const createdItem = await entityManager
            .getRepository(UserRoleUserRight)
            .save(userRoleUserRightModel);
          const fullItem = await entityManager
            .getRepository(UserRoleUserRight)
            .findOne({
              where: { id: createdItem.id },
              relations: { userRight: true },
              select: {
                id: true,
                userRight: {
                  id: true,
                  uaDescription: true,
                  uaName: true,
                },
              },
            });

          userRoleUserRights.push(fullItem);
        }

        return {
          ok: true,
          message: commonSuccessMessages.user_role_created,
          data: {
            userRole: {
              ...this.createDtoModel(newUserRoleItem),
              userRoleUserRights,
            },
          },
        };
      },
    );
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
    const item = await this._userRoleService.findOneByOptions({
      where: { id: id },
      relations: { userRoleUserRights: { userRight: true } },
      select: {
        id: true,
        name: true,
        alias: true,
        uaName: true,
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
    if (!item) {
      return {
        ok: false,
        message: commonErrorMessages.user_role_not_exists,
      };
    }

    const user: IGetMeResponse = (request as any).user;
    const userRank = this._userService.getUserRoleRank(user);

    const { name, alias, uaName, rank, userRightIds } = body;

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

    return await this._dataSource.transaction(
      async (entityManager: EntityManager) => {
        const userRightsIdsToAdd: number[] = [];
        const userRoleUserRightsIdsToDelete: number[] = [];
        item?.userRoleUserRights.forEach((userRoleUserRight) => {
          const userRightId = userRoleUserRight.userRight.id;
          if (!userRightIds.includes(userRightId)) {
            userRoleUserRightsIdsToDelete.push(userRoleUserRight.id);
          }
        });
        userRightIds.forEach((userRightId) => {
          const userRightExists = item?.userRoleUserRights?.find(
            (userRoleUserRight) =>
              userRoleUserRight.userRight.id === userRightId,
          );
          if (!userRightExists) {
            userRightsIdsToAdd.push(userRightId);
          }
        });

        const itemsToRemove = await entityManager
          .getRepository(UserRoleUserRight)
          .find({
            where: { id: In(userRoleUserRightsIdsToDelete) },
            select: { id: true },
          });

        await entityManager
          .getRepository(UserRoleUserRight)
          .remove(itemsToRemove);

        for (const userRightsIdToAdd of userRightsIdsToAdd) {
          const userRoleUserRightModel: UserRoleUserRight = {
            id: undefined,
            userRoleId: item.id,
            userRightId: userRightsIdToAdd,
            ...this._userRoleUserRightService.getCreatedUpdated(user.id),
          };

          await entityManager
            .getRepository(UserRoleUserRight)
            .save(userRoleUserRightModel);
        }

        item.alias = alias;
        item.name = name;
        item.uaName = uaName;
        item.rank = rank;
        item.updatedDate = new Date();
        item.updatedByUserId = user.id;

        const newUserRoleUserRights = await entityManager
          .getRepository(UserRoleUserRight)
          .find({
            where: { userRoleId: item.id },
            relations: { userRight: true },
            select: {
              id: true,
              userRight: {
                id: true,
                uaName: true,
                uaDescription: true,
              },
            },
          });

        item.userRoleUserRights = newUserRoleUserRights;

        const updatedItem = await entityManager
          .getRepository(UserRole)
          .save(item);

        return {
          ok: true,
          message: commonSuccessMessages.user_role_updated,
          data: {
            userRole: {
              ...this.createDtoModel(updatedItem),
              userRoleUserRights: updatedItem.userRoleUserRights,
            },
          },
        };
      },
    );
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

  private createDtoModel(model: UserRole) {
    return {
      id: model.id,
      name: model.name,
      alias: model.alias,
      uaName: model.uaName,
      rank: model.rank,
    };
  }
}
