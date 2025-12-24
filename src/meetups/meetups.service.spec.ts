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

  // -------- TEST 1: VALIDATE HOURS --------
  it('should throw a bad request error if startTime is greater than or equal to endTime', async () => {
    const dto: any = {
      startTime: '10:00',
      endTime: '09:30',
    };

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  // -------- TEST 2: Succesfull creation --------
  it('Should create a meetup succesfully', async () => {
    const dto: any = {
      createdBy: 1,
      title: 'Meetup Test',
      description: 'Una prueba',
      date: '2025-11-20',
      startTime: '10:00',
      endTime: '12:00',
      locationName: 'Parque',
      latitude: 13.7,
      longitude: -89.2,
    };

    const expectedResult = {
      id: 1,
      ...dto,
      date: new Date(dto.date),
    };

    prismaMock.meetup.create.mockResolvedValue(expectedResult);

    const result = await service.create(dto);

    expect(prismaMock.meetup.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  // no filters

  it('Should return all meetups when no filters are given', async () => {
    await service.get({});

    expect(prismaMock.meetup.findMany).toHaveBeenCalledWith({
      where: {}
    });
  })

  // start date filter

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
