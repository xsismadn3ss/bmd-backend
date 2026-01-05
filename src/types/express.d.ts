import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

declare global {
  namespace Express {
    interface Request {
      user: JwtUser; // adding the user property to the Request object
    }
  }
}