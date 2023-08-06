import { ConsoleLogger, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WinstonLogger } from 'src/logging/winston.logger';
import { UUID } from 'crypto';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>, private readonly logger: WinstonLogger) {}

    async create(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            const user = await this.repo.create({ email, password });

            const result: User = await this.repo.save(user);

            if (!result) return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');

            return new ResponseWrapper(HttpStatus.CREATED, 'User created successfully', result);
        } catch (error) {
            this.logger.error('create', error, traceId);

            return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
        }
    }

    async getAll(email: string = null, traceId: UUID): Promise<ResponseWrapper<User[]>> {
        try {
            const users = await this.repo.find({ where: { email } });

            return new ResponseWrapper(HttpStatus.OK, 'Users returned successfully', users);
        } catch (error) {
            this.logger.error('getAll', error, traceId);

            return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
        }
    }

    async get(id: number, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            const user = await this.repo.findOneBy({ id });

            if (!user) return new ResponseWrapper(HttpStatus.NO_CONTENT, 'User not found');

            return new ResponseWrapper(HttpStatus.OK, 'User returned successfully', user);
        } catch (error) {
            this.logger.error('get', error, traceId);

            return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
        }
    }

    async update(id: number, props: Partial<User>, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            let user = await this.repo.findOne({ where: { id } });

            if (!user) return new ResponseWrapper(HttpStatus.NO_CONTENT, 'User not found');

            Object.assign(user, props);

            const newUser: User = await this.repo.save(user);

            if (!newUser) return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');

            return new ResponseWrapper(HttpStatus.OK, 'User updated successfully', newUser);
        } catch (error) {
            this.logger.error('update', error, traceId);

            return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
        }
    }

    async delete(id: number, traceId: UUID): Promise<ResponseWrapper<Boolean>> {
        try {
            const user = await this.repo.findOneBy({ id });

            if (!user) return new ResponseWrapper(HttpStatus.NO_CONTENT, 'User not found');

            const success: User = await this.repo.remove(user);

            if (!success) return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');

            return new ResponseWrapper(HttpStatus.NO_CONTENT, 'User deleted successfully');
        } catch (error) {
            this.logger.error('delete', error, traceId);

            return new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
        }
    }
}
