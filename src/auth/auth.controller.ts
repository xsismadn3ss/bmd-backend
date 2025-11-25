import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthCredentialsDTO, AuthLoginDto } from './auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';
import type { Request } from 'express';

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
  @Public()
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
      password: passwordHash
    });

    const userRoles = user.roles.map((role) => role.role.name); // get the user's role names

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles: userRoles // include roles in the payload to access them later
    };

    const token = this.jwtService.sign(payload);

    return {
      name,
      token,
    }
  }

  @Public()
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

    const existingUserRoles = existingUser.roles.map(role => role.role.name);

    const payload = {
      sub: existingUser.id,
      name: existingUser.name,
      email,
      roles: existingUserRoles
    };

    const token = this.jwtService.sign(payload);

    return {
      name: existingUser.name,
      token,
    }
  }

  @Get('validate-token')
  @ApiOperation({summary: "Validar el token del usuario"})
  @ApiResponse({
    status: 200,
    description: 'Mensaje de bienvenida si el token es válido',
    type: Object
  })
  @ApiBearerAuth('access-token') // bearer token required
  @HttpCode(HttpStatus.OK)
  async validateToken(@Req() req: Request): Promise<{message: string}> {
    const user = req['user'];
    return {message: `Bienvenido ${user.name}`};
  }
}
