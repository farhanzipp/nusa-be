import { Role } from "../../enums/role.enum";

export interface JwtPayload {
    username: string;
    role: Role[];
    sub: number;
    iat?: number;
    exp?: number;
}