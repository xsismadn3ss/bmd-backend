import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const prismaMock = {
    user: {
      update: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("updateById", () => {
    it('should throw BadRequestException if data is empty', async () => {
      await expect(service.updateById(1, {} as any)).rejects.toThrow(
        BadRequestException,
      );

      expect(prisma.user.update).not.toHaveBeenCalled();
   });

    it('should update user and include roles', async () => {
      const updateData = {
        name: 'Arturo',
      };

      const updatedUser = {
        id: 1,
        name: 'Arturo',
        roles: [
          {
            role: {
              id: 1,
              name: 'USER',
            },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prisma.user, 'update').mockResolvedValue(updatedUser as any);

      const result = await service.updateById(1, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if Prisma throws P2025', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.x',
        },
      );

      jest.spyOn(prisma.user, 'update').mockRejectedValue(prismaError);

      await expect(
        service.updateById(999, { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
