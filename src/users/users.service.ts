import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { json } from 'stream/consumers';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
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
    if (createdUser) {
      const token = this.authService.generateJWT(createdUser.id);
      return { token };
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(username: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
