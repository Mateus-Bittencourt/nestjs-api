import {
  // forwardRef,
  // Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
// import { ConfigService } from '@nestjs/config';
// import dotenv from "dotenv";
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  // generateJWT(id: number) {
  //   const jwtSecret =
  //     process.env.JWT_SECRET ||
  //     '085B5CF3FB261C9CF855E99D64ED02CE299412977C3D713C850FD98C89CB4FF2';
  //   if (!jwtSecret)
  //     throw new Error('JWT_SECRET is not defined in environment variables'); //code from chatgpt
  //   return jwt.sign({ id }, jwtSecret, { expiresIn: '1d' });
  // }

  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    // const token = this.generateJWT(user.id);
    // return { token };


    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
