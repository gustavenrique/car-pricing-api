import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';

export class ResponseInteceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((response: ResponseWrapper<any>) => {
                context.switchToHttp().getResponse().status(response?.status).json(response);
            })
        );
    }
}
