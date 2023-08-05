import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

    async create(email: string, password: string): Promise<User> {
        try {
            const user = await this.repo.create({ email, password });

            return await this.repo.save(user);
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async getAll(email?: string): Promise<User[]> {
        try {
            const users = await this.repo.find({ where: { email } });

            return users;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async get(id: number): Promise<User> {
        try {
            const user = await this.repo.findOneBy({ id });

            if (!user)
                throw new NotFoundException({
                    message: 'User not found',
                    status: StatusCodes.NOT_FOUND,
                    object: false,
                });

            return user;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async update(id: number, props: Partial<User>): Promise<Boolean> {
        try {
            let user = await this.repo.findOne({ where: { id } });

            if (!user)
                throw new NotFoundException({
                    message: 'User not found',
                    status: StatusCodes.NOT_FOUND,
                    object: false,
                });

            Object.assign(user, props);

            const success: User = await this.repo.save(user);

            return success ? true : false;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async delete(id: number): Promise<Boolean> {
        try {
            const user = await this.repo.findOneBy({ id });

            if (!user)
                throw new NotFoundException({
                    message: 'User not found',
                    status: StatusCodes.NOT_FOUND,
                    object: false,
                });

            const success: User = await this.repo.remove(user);

            return success ? true : false;
        } catch (error) {
            console.error(error);
            return;
        }
    }
}
