import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { randomUUID } from 'crypto';
import { FullRequest } from 'src/domain/dtos/full-request';

export class RequestMiddleware implements NestMiddleware {
    use(req: FullRequest, res: Response, next: NextFunction) {
        req.startTime = performance.now();
        req.traceId = randomUUID();

        next();
    }
}
