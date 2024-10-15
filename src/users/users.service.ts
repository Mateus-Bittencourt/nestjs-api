import {
  BadRequestException,
  // forwardRef,
  // Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
    });
    if (newUser) throw new BadRequestException('User already exists');

    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );
    const createdUser = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
      },
      select: {
        id: true,
      }, // code from chatgpt
    });
    return createdUser;
    // console.log(createdUser);
    // if (createdUser) {
    //   const payload = { username: createdUser.username, sub: createdUser.id };
    //   return {
    //     access_token: await this.jwtService.sign(payload),
    //   };
    // }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(username: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  // generateJWT(id: number) {
  //   const jwtSecret =
  //     process.env.JWT_SECRET ||
  //     '085B5CF3FB261C9CF855E99D64ED02CE299412977C3D713C850FD98C89CB4FF2';
  //   if (!jwtSecret)
  //     throw new Error('JWT_SECRET is not defined in environment variables'); //code from chatgpt
    
  //   return jwt.sign({ id }, jwtSecret, { expiresIn: '1d' });
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
