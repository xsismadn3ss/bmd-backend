import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({
    example: 'satoshi@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '@strongPassword123',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthCredentialsDTO {
  @ApiProperty({
    example: 'Satoshi Nakamoto',
    description: 'Nombre del usuario',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'JSON Web Token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
