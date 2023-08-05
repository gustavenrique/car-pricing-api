import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from '../domain/dtos/users/create-user.dto';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { UsersService } from '../services/users.service';
import { User } from '../domain/entities/user.entity';
import { UUID, randomUUID } from 'crypto';
import { WinstonLogger } from 'src/logging/winston.logger';
import { Serialize } from '../interceptors/SerializeInterceptor';
import { UserDto } from 'src/domain/dtos/users/user.dto';
import { UpdateUserDto } from 'src/domain/dtos/users/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly service: UsersService, private readonly logger: WinstonLogger) {}

    @Post('/auth/signup')
    @ApiResponse({ status: StatusCodes.CREATED, description: 'Successfull response', type: User })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: 'Invalid Request Body' })
    async createUser(@Body() body: CreateUserDto): Promise<User> {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('createUser', `Begin - Email: ${body.email}`, traceId);

        const res = await this.service.create(body.email, body.password);

        this.logger.debug('createUser', `End - Successfull response: ${res != null} - Time: ${performance.now() - startTime}ms`, traceId);

        return res;
    }

    @Get()
    @Serialize(UserDto)
    @ApiQuery({ name: 'email', type: String, required: false })
    @ApiResponse({ status: StatusCodes.OK, type: Array<User> })
    async getAllUsers(@Query('email') email?: string): Promise<User[]> {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('getAllUsers', `Begin${email ? ` - Email: ${email}` : ''}`, traceId);

        const res = await this.service.getAll(email);

        this.logger.debug('getAllUsers', `End - Amount of users returned: ${res.length} - Time: ${performance.now() - startTime}ms`, traceId);

        return res;
    }

    @Get('/:id')
    @Serialize(UserDto)
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: StatusCodes.OK, type: User })
    async getUser(@Param('id') id: number): Promise<User> {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('getUser', `Begin - Id: ${id}`, traceId);

        const res: User = await this.service.get(id);

        this.logger.debug('getUser', `End - Response: ${JSON.stringify(res)} - Time: ${performance.now() - startTime}ms`, traceId);

        return res;
    }

    @Patch('/:id')
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: StatusCodes.OK, type: Boolean })
    async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
        const startTime: number = performance.now();

        const traceId = randomUUID();

        this.logger.debug('updateUser', `Begin - Id: ${id}`, traceId);

        const res: Boolean = await this.service.update(id, body);

        this.logger.debug('updateUser', `End - Response: ${JSON.stringify(res)} - Time: ${performance.now() - startTime}ms`, traceId);

        return res;
    }

    @Delete('/:id')
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: StatusCodes.OK, type: Boolean })
    async removeUser(@Param('id') id: number): Promise<Boolean> {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('removeUser', `Begin - Id: ${id}`, traceId);

        const res: Boolean = await this.service.delete(id);

        this.logger.debug('removeUser', `End - Response: ${JSON.stringify(res)} - Time: ${performance.now() - startTime}ms`, traceId);

        return res;
    }
}
