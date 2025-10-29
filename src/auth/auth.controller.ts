import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthCredentialsDTO, AuthLoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Registrar usuario
   * @param data CreateUserDTO con datos para registrar un nuevo usuario
   * @returns AuthCredentialsDTO con el nombre del usuario y el token
   */
  @Post('register')
  async register(@Body() body: CreateUserDTO): Promise<AuthCredentialsDTO> {
    const {name, email, password} = body;
    const passwordHash = await this.authService.hashPassword(password);

    const user = await this.userService.create({
      name,
      email,
      password: passwordHash
    });

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email
    }

    const token = this.jwtService.sign(payload);

    return {
      name,
      token
    }
  }

  @Post('login')
  async login(@Body() body: AuthLoginDto): Promise<AuthCredentialsDTO> {
    // TODO: implementar lógica para iniciar sesión (debe devolver un AuthCredentialsDTO)
    throw new NotImplementedException('No implementado');
  }
}
