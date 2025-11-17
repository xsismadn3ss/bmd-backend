import { Test, TestingModule } from '@nestjs/testing';
import { MeetupsService } from './meetups.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('MeetupsService', () => {
  let service: MeetupsService;

  const prismaMock = {
    meetup: {
      create: jest.fn(),
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
});
