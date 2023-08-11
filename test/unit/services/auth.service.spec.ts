import { IUsersService } from 'src/domain/interfaces/users.service.interface';
import { IAuthService } from 'src/domain/interfaces/auth.service.interface';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { HttpStatus, LoggerService } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { User } from 'src/domain/entities/user.entity';
import { UUID, randomUUID } from 'crypto';

describe('AuthService', () => {
    let service: IAuthService;
    let usersServiceFake: Partial<IUsersService>;
    let loggerFake: Partial<LoggerService>;
    const traceId: UUID = randomUUID();

    beforeEach(async () => {
        usersServiceFake = {
            getAll: jest.fn(() => Promise.resolve(new ResponseWrapper(HttpStatus.OK, '', []))),
            create: jest.fn((email: string, password: string) =>
                Promise.resolve(new ResponseWrapper(HttpStatus.OK, '', { id: 1, email, password } as User))
            ),
        };

        loggerFake = {
            error: jest.fn((callingMethod: string, message: string, traceId: UUID) => ''),
        };

        service = new AuthService(usersServiceFake as IUsersService, loggerFake as LoggerService);
    });

    describe('signup', () => {
        it('creates an instance of auth service', () => {
            expect(service).toBeDefined();
        });

        it('creates a user with a salted and hashed password', async () => {
            const { data: user } = await service.signup('asdf@asdf.com', 'asdf', traceId);

            expect(user.password).not.toEqual('asdf');

            const [salt, hash] = user.password.split('.');

            expect(salt).toBeDefined();
            expect(hash).toBeDefined();
        });

        it('returns an error if email is already taken', async () => {
            const response = new ResponseWrapper(HttpStatus.OK, '', [{ id: 1, email: 'asdf@asdf.com', password: '1' } as User]);

            usersServiceFake.getAll = (email: string = null, traceId: UUID) => Promise.resolve(response);

            const result = await service.signup('asdf@asdf.com', 'asdf', traceId);

            expect(result.status).toEqual(HttpStatus.BAD_REQUEST);
            expect(result.message).toContain('Email already taken');
            expect(result.data).toBeUndefined();
        });

        it('returns 500 if an exception is thrown', async () => {
            usersServiceFake.getAll = jest.fn((email: string = null, traceId: UUID) => {
                throw '';
            });

            const result = await service.signup('asdf@asdf.com', 'asdf', traceId);

            expect(result.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(result.message).toContain('An unexpected error occurred');
            expect(result.data).toBeUndefined();

            expect(usersServiceFake.getAll).toBeCalled();
            expect(usersServiceFake.create).not.toBeCalled();
            expect(loggerFake.error).toBeCalled();
        });
    });
});
