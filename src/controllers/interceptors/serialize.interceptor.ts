import { CallHandler, ExecutionContext, HttpStatus, NestInterceptor } from '@nestjs/common';
import { InternalServerError } from 'src/domain/dtos/http-responses';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

export class SerializeInterceptor<T> implements NestInterceptor {
    constructor(private readonly type: ClassConstructor<T>) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((response: ResponseWrapper<any>) => {
                try {
                    let serializedResponse: ResponseWrapper<T> = response;

                    if (this.type)
                        Object.assign(serializedResponse, {
                            data: plainToClass(this.type, response.data, {
                                excludeExtraneousValues: true,
                            }),
                        });

                    return serializedResponse;
                } catch (error) {
                    return InternalServerError('An unexpected error occurred');
                }
            })
        );
    }
}
