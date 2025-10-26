import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO, UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Filtrar usuario por email
   * @param email email de usuario
   * @returns Usuario filtrado por email
   * @throws error `404` en caso no se encuentre el usuario
   */
  async findByEmail(email: string): Promise<UserDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserDTO;
  }

  /**
   * Registrar usuario
   * @param data DTO con datos para registrar un nuevo usuario
   * @returns usuario creado
   * @throws error `405` en caso se intente crear un usuario con un email ya ocupado
   */
  async create(data: CreateUserDTO): Promise<UserDTO> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          ...data,
        },
      });
      const { password, ...userWithoutPassword } = createdUser;
      return userWithoutPassword as UserDTO;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una cuenta con este email');
      }
      throw error;
    }
  }
}
