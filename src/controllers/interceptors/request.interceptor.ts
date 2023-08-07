import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { UUID, randomUUID } from 'crypto';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/domain/entities/user.entity';

export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req: FullRequest = context.switchToHttp().getRequest();

        req.traceId = randomUUID();
        req.startTime = performance.now();

        return next.handle();
    }
}

export class FullRequest extends Request {
    traceId: UUID;
    startTime: number;
    currentUser: User;
    session: {
        userId: number;
    };
}
