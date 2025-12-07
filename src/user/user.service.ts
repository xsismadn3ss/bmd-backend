import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Filtrar usuario por email
   * @param email email de usuario
   * @returns Usuario filtrado por email
   * @throws error `404` en caso no se encuentre el usuario
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Registrar usuario
   * @param data DTO con datos para registrar un nuevo usuario
   * @returns usuario creado
   * @throws error `409` en caso se intente crear un usuario con un email ya ocupado
   */
  async create(data: CreateUserDTO) {
    try {
      // get the user created with its default role
      return await this.prisma.user.create({
        data: {
          ...data,
          roles: {
            create: {
              roleId: 1 // default user role: user
            }
          }
        },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una cuenta con este email');
      }
      throw error;
    }
  }

  /**
   * find a user by id
   * @param id user's id
   * @returns found user
   * @throws error 404 if not found
   */
  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException("user not found");
    }

    return user;
  }
}
