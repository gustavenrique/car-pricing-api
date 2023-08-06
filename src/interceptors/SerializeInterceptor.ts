import { CallHandler, ExecutionContext, HttpStatus, NestInterceptor, Type, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';

export const Serialize = (dto?: Type) => UseInterceptors(new SerializeInterceptor<typeof dto>(dto));

export class SerializeInterceptor<Type> implements NestInterceptor {
    constructor(private readonly type: ClassConstructor<Type>) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((response: ResponseWrapper<any>): ResponseWrapper<Type> => {
                try {
                    context.switchToHttp().getResponse().status(response.status);

                    let serializedResponse: ResponseWrapper<Type> = response;

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

                    return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
                }
            })
        );
    }
}
