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

  @Post('register')
  async register(@Body() body: CreateUserDTO): Promise<AuthCredentialsDTO> {
    // TODO: implementar lógica para registrarse (debe devolver un AuthCredentialsDTO)
    throw new NotImplementedException('Endpoint No implementado');
  }

  @Post('login')
  async login(@Body() body: AuthLoginDto): Promise<AuthCredentialsDTO> {
    // TODO: implementar lógica para iniciar sesión (debe devolver un AuthCredentialsDTO)
    throw new NotImplementedException('No implementado');
  }
}
