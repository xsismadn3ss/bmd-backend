import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Filtrar usuario por email
   * @param email email de usuario
   * @returns Usuario filtrado por email
   * @throws error `404` en caso no se encuentre el usuario
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
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
  async create(data: CreateUserDTO): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una cuenta con este email');
      }
      throw error;
    }
  }
}
