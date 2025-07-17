import { Controller, Get, UseGuards } from '@nestjs/common';
import { IGetUserRightsResponse } from '@repo/dto';
import { AdminAuthGuard } from 'src/guards/auth-admin.guard';
import { UserRightService } from 'src/services/admin/user-right.service';

@Controller('admin/user-right')
export class AdminUserRightController {
  constructor(private readonly _userRightService: UserRightService) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  async getAll(): Promise<IGetUserRightsResponse[]> {
    const items = await this._userRightService.findByOptions({
      select: {
        id: true,
        uaName: true,
      },
    });

    return items;
  }
}
