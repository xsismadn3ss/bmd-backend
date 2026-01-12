import { Test, TestingModule } from '@nestjs/testing';
import { MeetupsService } from './meetups.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { BoundariesDTO } from './boundaries.dto';

describe('MeetupsService', () => {
  let service: MeetupsService;

  const prismaMock = {
    meetup: {
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([])
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetupsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<MeetupsService>(MeetupsService);

    jest.clearAllMocks();
  });

  describe("create a meetup", () => {
    it("should throw a bad request error if both dates aren't in the same day", async () => {
      const dto: any = {
        startDateTime: '2026-12-20 10:00',
        endDateTime: '2026-12-21 09:30',
      };

      await expect(service.create(dto, 1)).rejects.toThrow(BadRequestException);
    });

    it("should throw a bad request error if meetup date is in the past", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const dto: any = {
        startDateTime: pastDate.toISOString().slice(0, 16).replace("T", " "),
        endDateTime: pastDate.toISOString().slice(0, 16).replace("T", " "),
      }

      await expect(service.create(dto, 1)).rejects.toThrow(BadRequestException);
    });

    it("should throw a bad request error if end time is less or equal to start time", async () => {
      const dto: any = {
        startDateTime: '2026-12-20 10:00',
        endDateTime: '2026-12-20 09:30',
      };

      await expect(service.create(dto, 1)).rejects.toThrow(BadRequestException);
    });

    it('Should create a meetup succesfully', async () => {
      const userId = 1;

      const dto: any = {
        title: 'Meetup Test',
        description: 'Una prueba',
        startDateTime: '2026-12-20 10:00',
        endDateTime: '2026-12-20 12:00',
        locationName: 'Parque',
        latitude: 13.7,
        longitude: -89.2,
      };

      const expectedResult = {
        id: 1,
        ...dto,
        startDateTime: new Date(dto.startDateTime),
        endDateTime: new Date(dto.endDateTime),
      };

      prismaMock.meetup.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto, userId);

      expect(prismaMock.meetup.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  })

  describe("get meetups with optional filters", () => {
    it('Should return all meetups when no filters are given', async () => {
      await service.get({});

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {}
      });
    });

    it('should filter by title', async () => {
      await service.get({title: "bitcoin"});

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: "bitcoin"
          }
        }
      });
    })

    // start date filter

    it('should filter from a start date', async () => {
      await service.get({startDate: '2025-11-26'});

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: new Date("2025-11-26")
          }
        }
      })
    });

    // end date filter

    it('should filter to an end date', async () => {
      await service.get({endDate: '2025-11-25'});

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            lte: new Date('2025-11-25')
          }
        }
      })
    });

    // start and end date filter

    it("should filter by both startDate and endDate", async () => {
      await service.get({
        startDate: "2025-11-20",
        endDate: "2025-11-30"
      });

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: new Date("2025-11-20"),
            lte: new Date("2025-11-30")
          }
        }
      });
    });

    // start time filter

    it("should filter by startTime", async () => {
      await service.get({startTime: "10:00"});

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          startTime: { gte: "10:00" }
        },
      });
    });

    // end time filter

    it("should filter by endTime", async () => {
      await service.get({ endTime: "15:00" });

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          endTime: { lte: "15:00" }
        },
      });
    });

    // start and end time filter

    it("should filter by start time and end time", async () => {
      await service.get({ startTime: "12:00", endTime: "15:00" });

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          startTime: { gte: "12:00"},
          endTime: { lte: "15:00" }
        },
      });
    });
  
    // boundaries filter

    it('should filter by boundaries', async () => {
      const boundaries: BoundariesDTO = {
        minLat: 11.04,
        maxLat: 12.9,
        minLng: 4.4,
        maxLng: 24.4
      }

      await service.get({boundaries});

      expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
        where: {
          latitude: {
            gte: boundaries.minLat,
            lte: boundaries.maxLat
          },
          longitude: {
            gte: boundaries.minLng,
            lte: boundaries.maxLng
          }  
        }
      })
    });
  });
});
