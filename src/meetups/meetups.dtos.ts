import { 
  IsDateString, 
  IsLatitude, 
  IsLongitude, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
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
    example: "2025-01-15 12:30",
    description: "Date and start time of the meetup in ISO format (YYYY-MM-DD HH:mm)",
  })
  @IsDateString({}, { message: "date must be a valid datetime" })
  startDateTime: string;

  @ApiProperty({
    example: "2025-01-15 13:30",
    description: "Date and end time of the meetup in ISO format (YYYY-MM-DD HH:mm)",
  })
  @IsDateString({}, { message: "date must be a valid datetime" })
  endDateTime: string;

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

export class UpdateMeetupDTO {
  @ApiPropertyOptional({
    example: "Adopting bitcoin",
    description: "Title of the meetup",
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "title cannot exceed 100 characters" })
  title?: string;

  @ApiPropertyOptional({
    example: "The best bitcoin meetup in the world",
    description: "The description of the meetup",
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "description cannot exceed 500 characters" })
  description?: string;

  @ApiPropertyOptional({
    example: "2026-01-16 12:30",
    description: "start date and time of the meetup",
  })
  @IsOptional()
  startDateTime?: string;

  @ApiPropertyOptional({
    example: "2026-01-16 14:30",
    description: "end date and time of the meetup",
  })
  @IsOptional()
  endDateTime?: string;

  @ApiPropertyOptional({
    example: "Salon de Eventos Salamanca",
    description: "Name of the meetup location",
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: "locationName cannot exceed 150 characters" })
  locationName?: string;

  @ApiPropertyOptional({
    example: 13.69294,
    description: "Latitude of the meetup location",
  })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    example: -89.21819,
    description: "Longitude of the meetup location",
  })
  @IsOptional()
  @IsLongitude()
  longitude?: number;
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
    example: "2025-01-15T12:30:00.000Z",
    description: "Date and start time of the meetup in ISO format",
  })
  startDateTime: Date;

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
    example: "bitcoin",
    description: "title keyword to filter meetups",
    type: String
  })
  @IsOptional()
  @IsString()
  title?: string;

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

export class UpdateMeetupResponse {
  @ApiProperty({
    example: "Meetup updated successfully",
    description: "Response message sent by the server",
  })
  message: string;

  @ApiProperty({
    description: "Updated meetup data",
    type: MeetupEntity
  })
  meetup: MeetupEntity;
}