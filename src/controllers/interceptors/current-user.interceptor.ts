import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { IUsersService } from 'src/domain/interfaces/users.service.interface';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { User } from 'src/domain/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(@Inject('IUsersService') private readonly usersService: IUsersService) {}

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
