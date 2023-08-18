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
    let loggerFake: Partial<LoggerService> = { error: jest.fn() };
    const traceId: UUID = randomUUID();

    beforeEach(async () => {
        usersServiceFake = {
            getAll: jest.fn(() => Promise.resolve(new ResponseWrapper(HttpStatus.OK, '', []))),
            create: jest.fn((email: string, password: string) =>
                Promise.resolve(new ResponseWrapper(HttpStatus.OK, '', { id: 1, email, password } as User))
            ),
        };

        service = new AuthService(usersServiceFake as IUsersService, loggerFake as LoggerService);
    });

    describe('signup', () => {
        it('returns an error if email is already taken', async () => {
            // arrange
            const response = new ResponseWrapper(HttpStatus.OK, '', [{ id: 1, email: 'asdf@asdf.com', password: '1' } as User]);

            usersServiceFake.getAll = (email: string = null, traceId: UUID) => Promise.resolve(response);

            // act
            const res = await service.signup('asdf@asdf.com', 'asdf', traceId);

            // assert
            expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
            expect(res.message).toContain('Email already taken');
            expect(res.data).toBeUndefined();
        });

        it('returns 500 if an exception is thrown', async () => {
            // arrange
            usersServiceFake.getAll = jest.fn((email: string = null, traceId: UUID) => {
                throw '';
            });

            // act
            const res = await service.signup('asdf@asdf.com', 'asdf', traceId);

            // assert
            expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(res.message).toContain('An unexpected error occurred');
            expect(res.data).toBeUndefined();

            expect(usersServiceFake.getAll).toBeCalled();
            expect(usersServiceFake.create).not.toBeCalled();
            expect(loggerFake.error).toBeCalled();
        });

        it('creates a user with a salted and hashed password', async () => {
            // act
            const { data: user } = await service.signup('asdf@asdf.com', 'asdf', traceId);

            // assert
            expect(user.password).not.toEqual('asdf');

            const [salt, hash] = user.password.split('.');

            expect(salt).toBeDefined();
            expect(hash).toBeDefined();
        });
    });

    describe('signin', () => {
        it("returns 400 if the user doesn't exist", async () => {
            // act
            const { status, message, data } = await service.signin('asdf@asdf.com', 'asdf', traceId);

            // assert
            expect(data).toBeUndefined();
            expect(status).toEqual(HttpStatus.BAD_REQUEST);
            expect(message).toContain('User not found');
            expect(usersServiceFake.getAll).toBeCalled();
        });

        it('returns 400 if the password is wrong', async () => {
            // arrange
            const response = new ResponseWrapper(HttpStatus.OK, '', [{ email: 'asdf@asdf.com', password: 'asdf' } as User]);

            usersServiceFake.getAll = jest.fn((email: string = null, traceId: UUID) => Promise.resolve(response));

            // act
            const { status, message, data } = await service.signin('asdf@asdf.com', 'wrongpassword', traceId);

            // assert
            expect(data).toBeUndefined();
            expect(message).toContain('Wrong password');
            expect(status).toBe(HttpStatus.BAD_REQUEST);
            expect(usersServiceFake.getAll).toBeCalled();
        });

        it('returns 500 if an exception is thrown', async () => {
            // arrange
            usersServiceFake.getAll = jest.fn((email: string, traceId: UUID) => {
                throw '';
            });

            // act
            const { data, message, status } = await service.signin('asdf@asdf.com', 'asdf', traceId);

            // assert
            expect(status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(message).toContain('An unexpected error occurred');
            expect(data).toBeUndefined();

            expect(usersServiceFake.getAll).toBeCalled();
            expect(usersServiceFake.create).not.toBeCalled();
            expect(loggerFake.error).toBeCalled();
        });

        it('returns the user if everything went ok', async () => {
            // arrange
            const [plainPassword, email] = ['asdf', 'asdf@adsf.com'];

            const { data: user } = await service.signup(email, plainPassword, traceId);

            const response = new ResponseWrapper(HttpStatus.OK, '', [
                {
                    email: user.email,
                    password: user.password,
                } as User,
            ]);

            usersServiceFake.getAll = jest.fn((email: string, traceId: UUID) => Promise.resolve(response));

            // act
            const { data, message, status } = await service.signin(user.email, plainPassword, traceId);

            // assert
            expect(data).not.toBeUndefined();
            expect(status).toEqual(HttpStatus.OK);
            expect(message).toContain('User logged in successfully');
            expect(usersServiceFake.getAll).toBeCalledWith(email, traceId);
        });
    });
});
