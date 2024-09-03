import { Role } from "../../enums/role.enum";

export interface JwtPayload {
    username: string;
    roles: Role[];
    sub: number;
}