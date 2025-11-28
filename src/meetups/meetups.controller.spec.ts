import { Test, TestingModule } from '@nestjs/testing';
import { MeetupsController } from './meetups.controller';
import { MeetupsService } from './meetups.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('MeetupsController', () => {
  let controller: MeetupsController;
  let service: MeetupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetupsController],
      providers: [
        {
          provide: MeetupsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeetupsController>(MeetupsController);
    service = module.get<MeetupsService>(MeetupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a meetup', async () => {
    const dto = {
      createdBy: 1,
      title: "adopting bitcoin",
      description: 'nice',
      date: '2025-12-01 00:00:00',
      startTime: '10:00',
      endTime: '12:00',
      locationName: 'Test location',
      latitude: 98.2,   
      longitude: 190.2,  
    };

    const response = {
        id: 1,
        ...dto,
        date: new Date(dto.date),
        latitude: new Decimal(dto.latitude),
        longitude: new Decimal(dto.longitude),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    jest.spyOn(service, 'create').mockResolvedValue(response);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      message: 'meetup creada exitosamente',
      meetup: response,
    });
  });
});
