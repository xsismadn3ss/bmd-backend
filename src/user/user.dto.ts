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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string;
}
