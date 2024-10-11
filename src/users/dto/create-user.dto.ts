import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    username: string;

    @MinLength(4)
    @MaxLength(20)
    @IsString()
    @IsNotEmpty()
    password: string;
}
