import { BadRequest, InternalServerError, Ok } from 'src/domain/dtos/http-responses';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { UUID, randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from 'src/domain/entities/user.entity';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { promisify } from 'util';
import { IUsersService } from 'src/domain/interfaces/users.service.interface';
import { IAuthService } from 'src/domain/interfaces/auth.service.interface';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService implements IAuthService {
    private readonly usersService: IUsersService;
    private readonly logger: LoggerService;

    constructor(@Inject('IUsersService') usersService: IUsersService, @Inject('LoggerService') logger: LoggerService) {
        this.usersService = usersService;
        this.logger = logger;
    }

    async signup(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            const users: User[] = (await this.usersService.getAll(email, traceId))?.data;

            if (users.length) return BadRequest('Email already taken');

            const salt = randomBytes(8).toString('hex');

            const hash = (await scrypt(password, salt, 32)) as Buffer;

            password = salt + '.' + hash.toString('hex');

            const user = await this.usersService.create(email, password, traceId);

            return user;
        } catch (error) {
            this.logger.error('signup', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }

    async signin(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            const [user] = (await this.usersService.getAll(email, traceId))?.data;

            if (!user) return BadRequest('User not found');

            const [salt, storedHash] = user.password.split('.');

            const hash = (await scrypt(password, salt, 32)) as Buffer;

            if (hash.toString('hex') !== storedHash) return BadRequest('Wrong password');

            return Ok('User logged in successfully', user);
        } catch (error) {
            this.logger.error('signup', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }
}
