import { IAuthService } from 'src/services/interfaces/auth.service.interface';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { AuthUserDto } from 'src/domain/dtos/users/auth-user.dto';
import { AuthController } from 'src/controllers/auth.controller';
import { CookieSession } from 'src/domain/dtos/cookie-session';
import { FullRequest } from 'src/domain/dtos/full-request';
import { HttpStatus, LoggerService } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { UUID, randomUUID } from 'crypto';

describe('AuthController', () => {
    const authServiceFake: Partial<IAuthService> = {};
    const loggerFake: Partial<LoggerService> = { debug: jest.fn() };
    const controller = new AuthController(authServiceFake as IAuthService, loggerFake as LoggerService);

    const req = { traceId: randomUUID() } as FullRequest;

    beforeEach(() => jest.clearAllMocks());

    it('signup', async () => {
        // arrange
        const userId = 1;
        const body: AuthUserDto = { email: 'asdf@asdf.com', password: 'asdf' };
        const session: CookieSession = { userId: null };

        const authResponse = new ResponseWrapper(HttpStatus.OK, 'User signed up successfully', {
            id: userId,
            email: body.email,
            password: body.password,
        } as User);

        authServiceFake.signup = jest.fn((email: string, password: string, traceId: UUID) => Promise.resolve(authResponse));

        // act
        const result = await controller.signup(req, body, session);

        // assert
        expect(result).toBe(authResponse);
        expect(authServiceFake.signup).toBeCalledWith(body.email, body.password, req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(1, 'signup', expect.any(String), req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(2, 'signup', expect.any(String), req.traceId);
        expect(session.userId).toBe(userId);
    });

    it('signin', async () => {
        // arrange
        const userId = 1;
        const body: AuthUserDto = { email: 'asdf@asdf.com', password: 'asdf' };
        const session: CookieSession = { userId: null };

        const authResponse = new ResponseWrapper(HttpStatus.OK, 'User signed up successfully', {
            id: userId,
            email: body.email,
            password: body.password,
        } as User);

        authServiceFake.signin = jest.fn((email: string, password: string, traceId: UUID) => Promise.resolve(authResponse));

        // act
        const result = await controller.signin(req, body, session);

        // assert
        expect(result).toBe(authResponse);
        expect(authServiceFake.signin).toBeCalledWith(body.email, body.password, req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(1, 'signin', expect.any(String), req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(2, 'signin', expect.any(String), req.traceId);
        expect(session.userId).toBe(userId);
    });
});
