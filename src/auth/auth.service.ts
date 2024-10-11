import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import dotenv from "dotenv";

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  generateJWT(id: number) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
      throw new Error('JWT_SECRET is not defined in environment variables'); //code from chatgpt
    return jwt.sign({ id }, jwtSecret, { expiresIn: '1d' });
  }
}
