import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'testKey',
      signOptions: { expiresIn: '60s' }, // expiring time will be changed in production
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
  exports: [AuthService, JwtModule] // export JwtModule to use it in other modules because AuthGuard is global and it needs JwtService
})
export class AuthModule {}
