import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';

export const Serialize = (dto: any) => UseInterceptors(new SerializeInterceptor<typeof dto>(dto));

export class SerializeInterceptor<Type> implements NestInterceptor {
    constructor(private readonly type: ClassConstructor<Type>) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToClass(this.type, data, {
                    excludeExtraneousValues: true,
                });
            })
        );
    }
}
