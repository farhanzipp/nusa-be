import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  roles?: Role[];
}
