import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthCredentialsDTO, AuthLoginDto } from './auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Registrar usuario
   * @returns AuthCredentialsDTO con el nombre del usuario y el token
   * @param body cuerpo de la petición
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    type: CreateUserDTO,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente',
    type: AuthCredentialsDTO,
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: CreateUserDTO): Promise<AuthCredentialsDTO> {
    const { name, email, password } = body;
    const passwordHash = await this.authService.hashPassword(password);

    const user = await this.userService.create({
      name,
      email,
      password: passwordHash,
    });

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      name,
      token,
    } as AuthCredentialsDTO;
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente',
    type: AuthCredentialsDTO,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthLoginDto): Promise<AuthCredentialsDTO> {
    const { email, password } = body;

    const existingUser = await this.userService.findByEmail(email);

    await this.authService.comparePasswords(password, existingUser.password);

    const payload = {
      sub: existingUser.id,
      name: existingUser.name,
      email,
    };

    const token = this.jwtService.sign(payload);

    return {
      name: existingUser.name,
      token,
    } as AuthCredentialsDTO;
  }
}
