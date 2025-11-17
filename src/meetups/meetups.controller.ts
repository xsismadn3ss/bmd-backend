import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateMeetupDTO, MeetupResponseDTO} from "./meetups.dtos";
import { MeetupsService } from "./meetups.service";
import { MeetupEntity } from "./meetups.dtos";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

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
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateMeetupDTO): Promise<MeetupResponseDTO>  {
        const meetup = await this.meetupsService.create(body);

        // this mapping is necessary because MeetupResponseDTO's meetup property is of type MeetupEntity
        const entity = Object.assign(new MeetupEntity(), meetup);

        return {
            message: "meetup creada exitosamente",
            meetup: entity
        }
    }
}