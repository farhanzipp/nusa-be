import { JwtPayload } from "./jwt-payload.type";

export type JwtRefreshTokenPayload = JwtPayload & { refresh_token: string };
