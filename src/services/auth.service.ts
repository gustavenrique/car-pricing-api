import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { WinstonLogger } from 'src/cross-cutting/logging/winston.logger';
import { UUID, randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from 'src/domain/entities/user.entity';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    private readonly usersService: UsersService;
    private readonly logger: WinstonLogger;

    constructor(usersService: UsersService, logger: WinstonLogger) {
        this.usersService = usersService;
        this.logger = logger;
    }

    async signup(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            const users: User[] = (await this.usersService.getAll(email, traceId))?.data;

            if (users.length) return new ResponseWrapper(HttpStatus.BAD_REQUEST, 'Email already taken');

            const salt = randomBytes(8).toString('hex');

            const hash = (await scrypt(password, salt, 32)) as Buffer;

            password = salt + '.' + hash.toString('hex');

            const user = await this.usersService.create(email, password, traceId);

            return user;
        } catch (error) {
            this.logger.error('signup', error, traceId);

            return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
        }
    }

    async signin(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            const [user] = (await this.usersService.getAll(email, traceId))?.data;

            if (!user) return new ResponseWrapper(HttpStatus.BAD_REQUEST, 'User not found');

            const [salt, storedHash] = user.password.split('.');

            const hash = (await scrypt(password, salt, 32)) as Buffer;

            if (hash.toString('hex') !== storedHash) return new ResponseWrapper(HttpStatus.BAD_REQUEST, 'Wrong password');

            return new ResponseWrapper(HttpStatus.OK, 'User logged in successfully', user);
        } catch (error) {
            this.logger.error('signup', error, traceId);

            return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
        }
    }
}
