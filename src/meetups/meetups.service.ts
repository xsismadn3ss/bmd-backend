import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMeetupDTO, GetMeetupsDTO } from "./meetups.dtos";
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

        // validate that the meetup's date is not in the past.

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
    
}