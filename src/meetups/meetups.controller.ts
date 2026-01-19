import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req } from "@nestjs/common";
import { CreateMeetupDTO, GetMeetupsDTO, GetMeetupsResponseDTO, MeetupResponseDTO, UpdateMeetupDTO, UpdateMeetupResponse} from "./meetups.dtos";
import { MeetupsService } from "./meetups.service";
import { MeetupEntity } from "./meetups.dtos";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { JwtUser } from "src/auth/interfaces/jwt-user.interface";
import { Public } from "src/auth/public.decorator";

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

    @Public()
    @Post("filter")
    @ApiOperation({summary: "get all meetups with optional filters"})
    @ApiBody({type: GetMeetupsDTO, required: true})
    @ApiResponse({
        status: 200,
        description: "list of meetups"
    })
    @HttpCode(HttpStatus.OK)
    async get(@Body() body: GetMeetupsDTO): Promise<GetMeetupsResponseDTO> {
        const meetups = await this.meetupsService.get(body);

        return {
            meetups
        }

    }

    @Patch(":id")
    @ApiOperation({summary: "update a meetup"})
    @ApiBody({
        type: UpdateMeetupDTO,
        required: true
    })
    @ApiResponse({
        status: 200,
        description: "meetup updated successfully"
    })
    @ApiBearerAuth('access-token')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ParseIntPipe) id: number, @Req() req: Request & {user: JwtUser}, @Body() body: UpdateMeetupDTO): Promise<UpdateMeetupResponse> {
        const userId = req.user.sub;
        const meetup = await this.meetupsService.update(body, id, userId);

        const entity = Object.assign(new MeetupEntity(), meetup);

        return {
            message: "meetup updated successfully",
            meetup: entity
        }
    }

}