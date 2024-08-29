import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        console.log('requiredRoles:', requiredRoles);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log('user:', user);

        if (!user || !user.roles) {
            console.error('RolesGuard: user or user.roles is not defined');
            return false;
        }

        return user.roles.some((role: Role) => requiredRoles.includes(role));
    }
}