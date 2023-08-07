import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { User } from 'src/domain/entities/user.entity';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private readonly usersService: UsersService) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();

        const userId: number = req?.session?.userId;

        if (userId) {
            console.log(this.usersService);
            const user: ResponseWrapper<User> = await this.usersService.get(userId, req.traceId);

            req.currentUser = user?.data as User;
        }

        return next.handle();
    }
}
