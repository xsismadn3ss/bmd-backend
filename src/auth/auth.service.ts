import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   * Crear hash de contraseña
   * @param password contraseña ingresada por usuario
   * @returns hash de la contraseña
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Validar contraseña
   * @param password contraseña ingresada por usuario
   * @param hashedPassword hash de la contraseña en la base de datos
   * @returns Verdadero o falso, al validar la contraseña
   */
  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) throw new UnauthorizedException('contrasenia incorrecta');

    return true;
  }
}
