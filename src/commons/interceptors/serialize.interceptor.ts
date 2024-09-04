import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassConstructor {
    new (...args: any[]): {}
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {}
    intercept(
        context: ExecutionContext, 
        next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any) => {
                const result = plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
                return result;
            })
        );
    }
}