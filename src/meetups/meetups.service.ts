import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMeetupDTO, GetMeetupsDTO } from "./meetups.dtos";
import { PrismaService } from "src/prisma/prisma.service";
import { Meetup } from "@prisma/client";
import { parseTime } from "src/utils/time";

@Injectable() 
export class MeetupsService {
    constructor(private readonly prisma: PrismaService){}
    
    async create(dto: CreateMeetupDTO, userId: number): Promise<Meetup> {
        const {title, description, date, startTime, endTime, locationName, latitude, longitude} = dto;

        const meetupDate = new Date(`${date}T${startTime}`);

        const now = new Date();

        // validate that the meetup's date is not in the past.

        if (meetupDate < now) {
          throw new BadRequestException("la fecha del meetup no puede ser en el pasado");
        }
        
        // validate that end time is not less or equal to start time

        const start = parseTime(startTime);
        const end = parseTime(endTime);

        if (end <= start) {
            throw new BadRequestException("la hora de finalización debe ser posterior a la hora de inicio");
        }

        const fullDate = new Date(date); // create date object because prisma needs a Date type. This date isn't affected by timezones since time is not specified.

        return this.prisma.meetup.create({
            data: {
              createdBy: userId,
              title: title,
              description: description,
              date: fullDate,
              startTime: startTime,
              endTime: endTime,
              locationName: locationName,
              latitude: latitude,
              longitude: longitude
            }
        });
  }

  async get(body: GetMeetupsDTO): Promise<Meetup[]> {
    const {title, startDate, endDate, startTime, endTime, boundaries} = body;

    const where: any = {};

    if (title) {
      where.title = {
        contains: title
      }
    }

    if (startDate || endDate) {
      where.date = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) })
      };
    }

    if (startTime) where.startTime = { gte: startTime };
    if (endTime) where.endTime = { lte: endTime };

    if (boundaries) {
      where.latitude = { gte: boundaries.minLat, lte: boundaries.maxLat };
      where.longitude = { gte: boundaries.minLng, lte: boundaries.maxLng };
    }

    return this.prisma.meetup.findMany({where});
  };
    
}