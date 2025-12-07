import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileDTO } from './profile.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get("/me")
    @ApiOperation({
        summary: "get my profile information"
    })
    @ApiResponse({
        status: 200,
        description: "returns the user's profile information"
    })
    @ApiBearerAuth("access-token")
    async getMe(@Req() req: Request): Promise<ProfileDTO> {
        const user = await this.userService.getById(req.user.sub);

        return {
            name: user.name,
            email: user.email,
            roles: user.roles.map(role => role.role.name),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }
}
