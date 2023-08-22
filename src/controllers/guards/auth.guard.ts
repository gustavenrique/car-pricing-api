import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FullRequest } from 'src/domain/dtos/full-request';
import { Unauthorized } from 'src/domain/dtos/http-responses';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req: FullRequest = context.switchToHttp().getRequest();

        const isLoggedIn = req.session.userId > 0;

        if (!isLoggedIn) throw new UnauthorizedException(Unauthorized('Must be logged in to access this resource'));

        return isLoggedIn;
    }
}
