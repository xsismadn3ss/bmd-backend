import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implementar métodos para manejar usuarios

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async create(name: string, email: string, password: string) {
    return this.prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });
  }
}
