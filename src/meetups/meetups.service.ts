import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMeetupDTO } from "./meetups.dtos";
import { PrismaService } from "src/prisma/prisma.service";
import { Meetup } from "@prisma/client";

@Injectable() 
export class MeetupsService {
    constructor(private readonly prisma: PrismaService){}
    async create(dto: CreateMeetupDTO): Promise<Meetup> {
        const {createdBy, title, description, date, startTime, endTime, locationName, latitude, longitude} = dto;
        // validate that end time is not less or equal to start time
        const start = this.parseTime(startTime);
        const end = this.parseTime(endTime);

        if (end <= start) {
            throw new BadRequestException("end time has to be greater than start time");
        }

        // Crear la fecha en formato Date
        const fullDate = new Date(date);

        return this.prisma.meetup.create({
            data: {
            createdBy: createdBy,
            title: title,
            description: description,
            date: fullDate,
            startTime: startTime,
            endTime: endTime,
            locationName: locationName,
            latitude: latitude,
            longitude: longitude,
            },
        });
  }

  // Function to convert HH:mm to minutes to be able to compare them.
  private parseTime(time: string) {
    const [hour, minutes] = time.split(":").map((number) => Number(number));
    return hour * 60 + minutes;
  }
    
}