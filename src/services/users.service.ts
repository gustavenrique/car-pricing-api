import { BadRequest, Created, InternalServerError, NoContent, Ok } from 'src/domain/dtos/http-responses';
import { IUsersService } from 'src/services/interfaces/users.service.interface';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class UsersService implements IUsersService {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        @Inject('LoggerService') private readonly logger: LoggerService
    ) {}

    async create(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            if (!email || !password) return BadRequest('Must provide Email and Password');

            const user = await this.repo.create({ email, password, active: true, admin: true });

            const result: User = await this.repo.save(user);

            if (!result) return InternalServerError('An unexpected error occurred');

            return Created('User created successfully', result);
        } catch (error) {
            this.logger.error('create', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }

    async getAll(email: string = null, traceId: UUID): Promise<ResponseWrapper<User[]>> {
        try {
            const users = await this.repo.find({ where: { email } });

            return Ok('Users returned successfully', users);
        } catch (error) {
            this.logger.error('getAll', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }

    async get(id: number, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            if (!id) return BadRequest('Must provide UserID');

            const user = await this.repo.findOneBy({ id });

            if (!user) return NoContent('User not found');

            return Ok('User returned successfully', user);
        } catch (error) {
            this.logger.error('get', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }

    async update(id: number, props: Partial<User>, traceId: UUID): Promise<ResponseWrapper<User>> {
        try {
            if (!id) return BadRequest('Must provide UserID');

            let user = await this.repo.findOne({ where: { id } });

            if (!user) return NoContent('User not found');

            Object.assign(user, props);

            const newUser: User = await this.repo.save(user);

            if (!newUser) return InternalServerError('An unexpected error occurred');

            return Ok('User updated successfully', newUser);
        } catch (error) {
            this.logger.error('update', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }

    async delete(id: number, traceId: UUID): Promise<ResponseWrapper<Boolean>> {
        try {
            if (!id) return BadRequest('Must provide UserID');

            const user = await this.repo.findOneBy({ id });

            if (!user) return NoContent('User not found');

            const success: User = await this.repo.remove(user);

            if (!success) return InternalServerError('An unexpected error occurred');

            return NoContent('User deleted successfully');
        } catch (error) {
            this.logger.error('delete', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }
}
