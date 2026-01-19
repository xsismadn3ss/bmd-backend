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
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      update: jest.fn()
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

  describe("update a meetup", () => {
    describe("initial validations", () => {
      it("should throw a no found exception if meetup does not exist", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue(null);

        await expect(service.update({}, 1, 1)).rejects.toThrow("meetup not found");
      });

      it("should throw an unauthorized exception if user is not the creator", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 2,
          startDateTime: new Date(Date.now() + 1000000),
        });
        
        await expect(service.update({}, 1, 1)).rejects.toThrow("unauthorized");
      });

      it("should throw a bad request exception if meetup has already happened", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date(Date.now() - 1000000),
        });

        await expect(service.update({}, 1, 1)).rejects.toThrow("you cannot update a meetup that has already happened");
      });
    });

    describe("validations when updating startDateTime", () => {
      it("should throw a bad request exception if updated startDateTime is in the past", async () => {
        const pastDate = new Date(Date.now() - 86400000); // 1 día en el pasado
        
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date(Date.now() + 86400000),
          endDateTime: new Date(Date.now() + 90000000),
        });

        const dto: any = {
          startDateTime: pastDate.toISOString().slice(0, 16).replace("T", " "),
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("meetup date cannot be in the past");
      });

      it("should throw a bad request exception if dates are not on the same day (updating startDateTime)", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00'),
          endDateTime: new Date('2030-01-15T12:00'),
        });

        const dto: any = {
          startDateTime: "2030-01-14 10:00",
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("meetup must start and end on the same day");
      });

      it("should throw a bad request exception if updated startDateTime is greater or equal to endDateTime", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          startDateTime: '2030-01-15 13:00', 
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("end date and time must be after start date and time");
      });

      it("should throw a bad request exception if meetup duration is less than one hour when updating startDateTime", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          startDateTime: "2030-01-15 11:30" // only 30 minutes of duration
        }

        await expect(service.update(dto, 1, 1)).rejects.toThrow("meetup must last at least one hour");
      });

      it("should successfully update when only startDateTime is updated correctly", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          startDateTime: "2030-01-15 09:00"
        }

        prismaMock.meetup.update.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T09:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const result = await service.update(dto, 1, 1);

        expect(prismaMock.meetup.update).toHaveBeenCalledWith({
          where: {
            id: 1
          },
          data: dto
        });

        expect(result).toEqual({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T09:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        })
      });
    })

    describe("validations when updating endDateTime", () => {
      it("should throw a bad request exception if dates are not on the same day (updating endDateTime)", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          endDateTime: '2030-01-16 12:00',
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("meetup must start and end on the same day");
      });

      it("should throw a bad request exception if updated endDateTime is before or equal to startDateTime", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          endDateTime: '2030-01-15 09:00',
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("end date and time must be after start date and time");
      });

      it("should throw a bad request exception if meetup duration is less than one hour when updating endDateTime", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          endDateTime: '2030-01-15 10:30',
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("meetup must last at least one hour");
      });

      it("should successfully update when only endDateTime is updated correctly", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          endDateTime: '2030-01-15 13:00',
        };

        prismaMock.meetup.update.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T13:00:00'),
        });

        const result = await service.update(dto, 1, 1);

        expect(prismaMock.meetup.update).toHaveBeenCalledWith({
          where: {
            id: 1
          },
          data: dto
        });

        expect(result).toEqual({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T13:00:00'),
        });
      });
    });

    describe("validations when updating both startDateTime and endDateTime", () => {
      it("should throw a bad request exception if dates are not on the same day (updating both)", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          startDateTime: '2030-01-15 10:00',
          endDateTime: '2030-01-16 12:00',
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("meetup must start and end on the same day");
      });

      it("should throw a bad request exception if updated endDateTime is before or equal to updated startDateTime", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          startDateTime: '2030-01-15 14:00',
          endDateTime: '2030-01-15 12:00',
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("end date and time must be after start date and time");
      });

      it("should throw a bad request exception if meetup duration is less than one hour when updating both", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          startDateTime: '2030-01-15 10:00',
          endDateTime: '2030-01-15 10:30',
        };

        await expect(service.update(dto, 1, 1)).rejects.toThrow("meetup must last at least one hour");
      });

      it("should successfully update when both startDateTime and endDateTime are updated correctly", async () => {
        prismaMock.meetup.findUnique.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T10:00:00'),
          endDateTime: new Date('2030-01-15T12:00:00'),
        });

        const dto: any = {
          startDateTime: '2030-01-15 11:00',
          endDateTime: '2030-01-15 13:00',
        };

        prismaMock.meetup.update.mockResolvedValue({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T11:00:00'),
          endDateTime: new Date('2030-01-15T13:00:00'),
        });

        const result = await service.update(dto, 1, 1);

        expect(prismaMock.meetup.update).toHaveBeenCalledWith({
          where: {
            id: 1
          },
          data: dto
        });

        expect(result).toEqual({
          id: 1,
          createdBy: 1,
          startDateTime: new Date('2030-01-15T11:00:00'),
          endDateTime: new Date('2030-01-15T13:00:00'),
        });
      });
    });
  });
});
