import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { FullRequest } from '../interceptors/request.interceptor';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req: FullRequest = context.switchToHttp().getRequest();

        const isLoggedIn = req.session.userId > 0;

        if (!isLoggedIn)
            throw new HttpException(new ResponseWrapper(HttpStatus.FORBIDDEN, 'Must be logged in to access this resource'), HttpStatus.FORBIDDEN);

        return isLoggedIn;
    }
}
