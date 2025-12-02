import { 
  IsDateString, 
  IsLatitude, 
  IsLongitude, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Matches, 
  MaxLength, 
  ValidateNested
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Meetup } from "@prisma/client";
import { BoundariesDTO } from "./boundaries.dto";
import { Type } from "class-transformer";

export class CreateMeetupDTO {
  @ApiProperty({
    example: "Adopting bitcoin",
    description: "Title of the meetup",
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty({ message: "title is required" })
  @MaxLength(100, { message: "title cannot exceed 100 characters" })
  title: string;

  @ApiProperty({
    example: "The best bitcoin meetup in the world",
    description: "The description of the meetup",
    maxLength: 500
  })
  @IsString()
  @IsNotEmpty({ message: "description is required" })
  @MaxLength(500, { message: "description cannot exceed 500 characters" })
  description: string;

  @ApiProperty({
    example: "2025-01-15",
    description: "Date of the meetup in ISO format (YYYY-MM-DD)",
  })
  @IsDateString({}, { message: "date must be a valid ISO date" })
  date: string;

  @ApiProperty({
    example: "14:30",
    description: "Start time in 24-hour format (HH:mm)",
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "startTime must be in HH:mm format",
  })
  startTime: string;

  @ApiProperty({
    example: "16:00",
    description: "End time in 24-hour format (HH:mm)",
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "endTime must be in HH:mm format",
  })
  endTime: string;

  @ApiProperty({
    example: "Salon de Eventos Salamanca",
    description: "Name of the meetup location",
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty({ message: "locationName is required" })
  @MaxLength(150, { message: "locationName cannot exceed 150 characters" })
  locationName: string;

  @ApiProperty({
    example: 13.69294,
    description: "Latitude of the meetup location",
  })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    example: -89.21819,
    description: "Longitude of the meetup location",
  })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
}

// this DTO is only used for swagger because swagger doesn't accept the type Meetup that Prisma generates. It only accepts classes

export class MeetupEntity {
  @ApiProperty({
    example: 1,
    description: "Unique ID of the meetup",
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: "Id of the user who created the meetup",
  })
  createdBy: number;

  @ApiProperty({
    example: "Adopting Bitcoin",
    maxLength: 100,
    description: "Title of the meetup",
  })
  title: string;

  @ApiProperty({
    example: "The best bitcoin meetup in the world",
    description: "The description of the meetup",
  })
  description: string;

  @ApiProperty({
    example: "2025-01-15T00:00:00.000Z",
    description: "Date of the meetup (stored as DateTime in the database)",
  })
  date: Date;

  @ApiProperty({
    example: "14:30",
    description: "Start time in HH:mm (24-hour format)",
  })
  startTime: string;

  @ApiProperty({
    example: "16:00",
    description: "End time in HH:mm (24-hour format)",
  })
  endTime: string;

  @ApiProperty({
    example: "Salon de Eventos Salamanca",
    maxLength: 150,
    description: "Name of the meetup location",
  })
  locationName: string;

  @ApiProperty({
    example: 13.69294,
    description: "Latitude of the meetup location",
  })
  latitude: number;

  @ApiProperty({
    example: -89.21819,
    description: "Longitude of the meetup location",
  })
  longitude: number;

  @ApiProperty({
    example: "2025-01-10T18:23:11.000Z",
    description: "Timestamp when the meetup was created",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2025-01-10T18:23:11.000Z",
    description: "Timestamp when the meetup was last updated",
  })
  updatedAt: Date;
}

export class MeetupResponseDTO {
  @ApiProperty({
    example: "Meetup successfully created",
    description: "Response message sent by the server",
  })
  message: string;

  @ApiProperty({
    description: "Meetup data returned after creation",
    type: MeetupEntity
  })
  meetup: MeetupEntity;
}

export class GetMeetupsDTO {
  @ApiPropertyOptional({
    example: "2025-01-01",
    description: "start date",
    type: String
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: "2025-12-31",
    description: "end date",
    type: String
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    example: "00:00",
    description: "start time",
    type: String
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    example: "23:59",
    description: "end time",
    type: String
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    description: "boundaries",
    type: BoundariesDTO
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BoundariesDTO)
  boundaries?: BoundariesDTO;
}

export class GetMeetupsResponseDTO {
  @ApiProperty({
    description: "List of meetups"
  })
  meetups: Meetup[];
}