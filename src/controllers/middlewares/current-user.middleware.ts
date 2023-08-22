import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { FullRequest } from 'src/domain/dtos/full-request';
import { IUsersService } from 'src/services/interfaces/users.service.interface';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(@Inject('IUsersService') private readonly usersService: IUsersService) {}

    async use(req: FullRequest, res: Response, next: NextFunction) {
        const userId: number = req?.session?.userId;

        if (userId) {
            const { data: user } = await this.usersService.get(userId, req.traceId);

            req.currentUser = user;
        }

        next();
    }
}
