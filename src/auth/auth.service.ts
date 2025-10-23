import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  // async hashPassword(password: string): Promise<string> {
  //   const saltRounds = 10;
  //   return bcrypt.hash(password, saltRounds);
  // }

  // async comparePasswords(
  //   password: string,
  //   hashedPassword: string,
  // ): Promise<boolean> {
  //   return bcrypt.compare(password, hashedPassword);
  // }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('email en uso');
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(name, email, hashedPassword);

    const payload = {
      sub: user.id,
      email: user.email
    }

    const token = this.jwtService.sign(payload);

    return {
      acces_token: token
    }
  }
}
