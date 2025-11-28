import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMeetupDTO } from "./meetups.dtos";
import { PrismaService } from "src/prisma/prisma.service";
import { Meetup } from "@prisma/client";

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

        const start = this.parseTime(startTime);
        const end = this.parseTime(endTime);

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

  // Function to convert HH:mm to minutes to be able to compare them.
  private parseTime(time: string) {
    const [hour, minutes] = time.split(":").map((number) => Number(number));
    return hour * 60 + minutes;
  }
    
}