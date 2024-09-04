import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import { Request } from "express";
import { JwtRefreshTokenPayload } from "../../../commons/types/jwt-refresh-token-payload.type";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: JwtRefreshTokenPayload) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        return {
            ...payload,
            refreshToken
        }
    }
}