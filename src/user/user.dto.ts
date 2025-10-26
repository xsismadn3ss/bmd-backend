import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

/**
 * Esquema para representar usuarios
 */
export class UserDTO {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

/**
 * Esquema para crear usuarios
 */
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
