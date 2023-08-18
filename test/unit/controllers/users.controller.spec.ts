import { FullRequest } from 'src/controllers/interceptors/request.interceptor';
import { IUsersService } from 'src/domain/interfaces/users.service.interface';
import { UpdateUserDto } from 'src/domain/dtos/users/update-user.dto';
import { UsersController } from 'src/controllers/users.controller';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { HttpStatus, LoggerService } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { UUID, randomUUID } from 'crypto';

describe('UsersController', () => {
    const usersServiceFake: Partial<IUsersService> = {};
    const loggerFake: Partial<LoggerService> = { debug: jest.fn() };
    const controller: UsersController = new UsersController(usersServiceFake as IUsersService, loggerFake as LoggerService);

    const req = { traceId: randomUUID() } as FullRequest;

    beforeEach(() => jest.clearAllMocks());

    it('getAllUsers', async () => {
        // arrange
        const email = 'asdf@asdf.com';

        const usersResponse = new ResponseWrapper(HttpStatus.OK, 'Users returned successfully', [{ email } as User]);

        usersServiceFake.getAll = jest.fn((email: string = null, traceId: UUID) => Promise.resolve(usersResponse));

        // act
        const response = await controller.getAllUsers(req, email);

        // assert
        expect(response).toBe(usersResponse);
        expect(usersServiceFake.getAll).toBeCalledWith(email, req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(1, 'getAllUsers', expect.any(String), req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(2, 'getAllUsers', expect.any(String), req.traceId);
    });

    it('getUser', async () => {
        // arrange
        const userId = 1;

        const userResponse = new ResponseWrapper(HttpStatus.OK, 'User returned successfully', { id: userId } as User);

        usersServiceFake.get = jest.fn((id: number, traceId: UUID) => Promise.resolve(userResponse));

        // act
        const response = await controller.getUser(req, userId);

        // assert
        expect(response).toBe(userResponse);
        expect(usersServiceFake.get).toBeCalledWith(userId, req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(1, 'getUser', expect.any(String), req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(2, 'getUser', expect.any(String), req.traceId);
    });

    it('updateUser', async () => {
        // arrange
        const userId = 1;

        const userResponse = new ResponseWrapper(HttpStatus.OK, 'User returned successfully', { id: userId } as User);

        usersServiceFake.update = jest.fn((id: number, body: UpdateUserDto, traceId: UUID) => Promise.resolve(userResponse));

        // act
        const response = await controller.updateUser(req, userId, {} as UpdateUserDto);

        // assert
        expect(response).toBe(userResponse);
        expect(usersServiceFake.update).toBeCalledWith(userId, {}, req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(1, 'updateUser', expect.any(String), req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(2, 'updateUser', expect.any(String), req.traceId);
    });

    it('removeUser', async () => {
        // arrange
        const userId = 1;

        const userResponse = new ResponseWrapper(HttpStatus.OK, 'User returned successfully', true);

        usersServiceFake.delete = jest.fn((id: number, traceId: UUID) => Promise.resolve(userResponse));

        // act
        const response = await controller.removeUser(req, userId);

        // assert
        expect(response).toBe(userResponse);
        expect(usersServiceFake.delete).toBeCalledWith(userId, req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(1, 'removeUser', expect.any(String), req.traceId);
        expect(loggerFake.debug).toHaveBeenNthCalledWith(2, 'removeUser', expect.any(String), req.traceId);
    });
});
