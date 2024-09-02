import { Expose, Exclude } from "class-transformer";
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
    accessToken: string;

    @Expose()
    refreshToken: string;
}