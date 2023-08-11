import { CallHandler, ExecutionContext, HttpStatus, NestInterceptor, Type, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { InternalServerError } from 'src/domain/dtos/http-responses';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';

export class SerializeInterceptor<T> implements NestInterceptor {
    constructor(private readonly type: ClassConstructor<T>) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((response: ResponseWrapper<any>): ResponseWrapper<T> => {
                try {
                    context.switchToHttp().getResponse().status(response.status);

                    let serializedResponse: ResponseWrapper<T> = response;

                    if (this.type)
                        serializedResponse = {
                            ...response,
                            data: plainToClass(this.type, response.data, {
                                excludeExtraneousValues: true,
                            }),
                        };

                    return serializedResponse;
                } catch (error) {
                    context.switchToHttp().getResponse().status(HttpStatus.INTERNAL_SERVER_ERROR);

                    return InternalServerError('An unexpected error occurred');
                }
            })
        );
    }
}
