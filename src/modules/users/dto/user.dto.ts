import { Expose, Exclude } from "class-transformer";
import { Token } from "src/commons/types/token.type";
import { Role } from "src/enums/role.enum";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    roles: Role[];       

    @Expose()
    token: Token;
}