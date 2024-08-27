import { Expose, Exclude } from "class-transformer";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    tokens: {
        access_token: string;
        refresh_token: string;
    };
}