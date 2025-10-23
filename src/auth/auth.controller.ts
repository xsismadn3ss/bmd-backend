import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // TODO: implementar endpoints para iniciar sesión, registrar usuarios y validar tokens

  @Post('register')
  async register(@Body() body: CreateUserDTO) {
    const {name, email, password} = body;

    // verificar si el email esta en uso

    return this.authService.register(name, email, password);
  }
}
