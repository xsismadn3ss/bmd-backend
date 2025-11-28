import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { CreateMeetupDTO, MeetupResponseDTO} from "./meetups.dtos";
import { MeetupsService } from "./meetups.service";
import { MeetupEntity } from "./meetups.dtos";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { JwtUser } from "src/auth/interfaces/jwt-user.interface";

@ApiTags('meetups')
@Controller('meetups')
export class MeetupsController {
    constructor(private readonly meetupsService: MeetupsService) {}

    @Post() 
    @ApiOperation({summary: "create a new meetup"})
    @ApiBody({
        type: CreateMeetupDTO,
        required: true
    })
    @ApiResponse({
        status: 201,
        description: "meetup registrada exitosamente",
        type: MeetupResponseDTO
    })
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.CREATED)
    async create(@Req() req: Request & {user: JwtUser}, @Body() body: CreateMeetupDTO): Promise<MeetupResponseDTO>  { 
        const userId = req.user.sub;

        const meetup = await this.meetupsService.create(body, userId);

        // this mapping is necessary because MeetupResponseDTO's meetup property is of type MeetupEntity
        const entity = Object.assign(new MeetupEntity(), meetup);

        return {
            message: "meetup creada exitosamente",
            meetup: entity
        }
    }
}