import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { FullRequest } from 'src/domain/dtos/full-request';
import { Forbidden } from 'src/domain/dtos/http-responses';

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req: FullRequest = context.switchToHttp().getRequest();

        const isAdmin = req?.currentUser?.admin;

        if (!isAdmin) throw new ForbiddenException(Forbidden('Must be an admin to access this resource'));

        return isAdmin;
    }
}
