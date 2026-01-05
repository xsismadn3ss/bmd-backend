import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileDTO, UpdateProfileDTO } from './profile.dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({
    summary: 'get my profile information',
  })
  @ApiResponse({
    status: 200,
    description: "returns the user's profile information",
    type: ProfileDTO,
  })
  @ApiBearerAuth('access-token')
  async getMe(@Req() req: Request): Promise<ProfileDTO> {
    const user = await this.userService.getById(req.user.sub);

    return {
      name: user.name,
      email: user.email,
      roles: user.roles.map((role) => role.role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as ProfileDTO;
  }

  @Patch('/me')
  @ApiOperation({
    summary: 'update my profile information',
  })
  @ApiBody({
    type: UpdateProfileDTO,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: "updates and returns the user's profile information",
    type: ProfileDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'No data provided to update',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBearerAuth('access-token')
  async updateMe(@Req() req: Request, @Body() body: UpdateProfileDTO): Promise<ProfileDTO> {
    const updatedUser = await this.userService.updateById(req.user.sub, body);
    
    return {
      name: updatedUser.name,
      email: updatedUser.email,
      roles: updatedUser.roles.map((role) => role.role.name),
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

  }
}
