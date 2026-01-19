import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateMeetupDTO, GetMeetupsDTO, UpdateMeetupDTO } from "./meetups.dtos";
import { PrismaService } from "src/prisma/prisma.service";
import { Meetup } from "@prisma/client";

@Injectable() 
export class MeetupsService {
  constructor(private readonly prisma: PrismaService){}
    
  async create(dto: CreateMeetupDTO, userId: number): Promise<Meetup> {
    const {title, description, startDateTime, endDateTime, locationName, latitude, longitude} = dto;

    const meetupStartDateTime = new Date(startDateTime);
    const meetupEndDateTime = new Date(endDateTime);

    const now = new Date();

    // validate both dates are on the same day.

    if (meetupStartDateTime.toISOString().split("T")[0] != meetupEndDateTime.toISOString().split("T")[0]) {
      throw new BadRequestException("meetup must start and end on the same day");
    }

    // validate that the meetup's datetime is not in the past.

    if (meetupStartDateTime < now) {
      throw new BadRequestException("meetup date cannot be in the past");
    }
    
    // validate that end time is not less or equal to start time

    if (startDateTime >= endDateTime) {
      throw new BadRequestException("end date and time must be after start date and time");
    }

    return this.prisma.meetup.create({
        data: {
          createdBy: userId,
          title,
          description,
          startDateTime: new Date(meetupStartDateTime),
          endDateTime: new Date(meetupEndDateTime),
          locationName,
          latitude,
          longitude
        }
    });
  }

  async get(body: GetMeetupsDTO): Promise<Meetup[]> {
    const {title, boundaries} = body;

    const where: any = {};

    if (title) {
      where.title = {
        contains: title
      }
    }

    if (boundaries) {
      where.latitude = { gte: boundaries.minLat, lte: boundaries.maxLat };
      where.longitude = { gte: boundaries.minLng, lte: boundaries.maxLng };
    }

    return this.prisma.meetup.findMany({where});
  };

  async update(dto: UpdateMeetupDTO, meetupId: number, userId: number): Promise<Meetup> {
    const meetup = await this.prisma.meetup.findUnique({
      where: {
        id: meetupId
      }
    });

    if (!meetup) {
      throw new NotFoundException("meetup not found");
    }

    if (meetup.createdBy !== userId) {
      throw new UnauthorizedException("unauthorized");
    }

    if (meetup.startDateTime < new Date()) {
      throw new BadRequestException("you cannot update a meetup that has already happened");
    }

    // validate dates if they are being updated

    if (dto.startDateTime) {
      this.validateMeetupDate(dto.startDateTime);
      if (dto.endDateTime) {
        this.areMeetupDatetimesOnSameDay(dto.startDateTime, dto.endDateTime);
        this.validateMeetupTime(dto.startDateTime, dto.endDateTime);
      } else {
        this.areMeetupDatetimesOnSameDay(dto.startDateTime, meetup.endDateTime.toISOString());
        this.validateMeetupTime(dto.startDateTime, meetup.endDateTime.toISOString());
      }
    } else {
      if (dto.endDateTime) {
        this.areMeetupDatetimesOnSameDay(meetup.startDateTime.toISOString(), dto.endDateTime);
        this.validateMeetupTime(meetup.startDateTime.toISOString(), dto.endDateTime);
      }
    }

    return await this.prisma.meetup.update({
      where: {
        id: meetupId
      },
      data: dto
    });
  }

  private areMeetupDatetimesOnSameDay(startDateTime: string, endDateTime: string) {
    const meetupStartDateTime = new Date(startDateTime);
    const meetupEndDateTime = new Date(endDateTime);

    if (meetupStartDateTime.toISOString().split("T")[0] != meetupEndDateTime.toISOString().split("T")[0]) {
      throw new BadRequestException("meetup must start and end on the same day");
    }
    return true;
  }

  private validateMeetupDate(date: string) {
    const meetupDate = new Date(date);
    const now = new Date();

    if (meetupDate < now) {
      throw new BadRequestException("meetup date cannot be in the past");
    }

    return true;
  }

  private validateMeetupTime(startDateTime: string, endDateTime: string) {// validate that end time is not less or equal to start time
    const meetupStartDateTime = new Date(startDateTime);
    const meetupEndDateTime = new Date(endDateTime);

    if (meetupEndDateTime <= meetupStartDateTime) {
      throw new BadRequestException("end date and time must be after start date and time");
    }

    const msDiference = meetupEndDateTime.getTime() - meetupStartDateTime.getTime();

    if (msDiference < 3600000) {
      throw new BadRequestException("meetup must last at least one hour");
    }

    return true;
  }
    
}