import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { SwaggerResponse, ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/domain/dtos/users/update-user.dto';
import { Serialize } from '../interceptors/SerializeInterceptor';
import { WinstonLogger } from 'src/logging/winston.logger';
import { UserDto } from 'src/domain/dtos/users/user.dto';
import { UsersService } from '../services/users.service';
import { User } from '../domain/entities/user.entity';
import { UUID, randomUUID } from 'crypto';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly logger: WinstonLogger) {}

    @Get()
    @Serialize(UserDto)
    @ApiQuery({ name: 'email', type: String, required: false })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK }, true)
    async getAllUsers(@Query('email') email?: string) {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('getAllUsers', `Begin${email ? ` - Email: ${email}` : ''}`, traceId);

        const res: ResponseWrapper<User[]> = await this.usersService.getAll(email, traceId);

        this.logger.debug(
            'getAllUsers',
            `End - Amount of users returned: ${res?.data?.length} - Time: ${(performance.now() - startTime).toFixed(0)}ms`,
            traceId
        );

        return res;
    }

    @Get('/:id')
    @Serialize(UserDto)
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK })
    async getUser(@Param('id') id: number) {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('getUser', `Begin - Id: ${id}`, traceId);

        const res: ResponseWrapper<User> = await this.usersService.get(id, traceId);

        this.logger.debug('getUser', `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - startTime).toFixed(0)}ms`, traceId);

        return res;
    }

    @Patch('/:id')
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateUserDto })
    @Serialize(UserDto)
    @SwaggerResponse(UserDto, { status: HttpStatus.OK })
    async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
        const startTime: number = performance.now();

        const traceId = randomUUID();

        this.logger.debug('updateUser', `Begin - Id: ${id}`, traceId);

        const res: ResponseWrapper<User> = await this.usersService.update(id, body, traceId);

        this.logger.debug('updateUser', `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - startTime).toFixed(0)}ms`, traceId);

        return res;
    }

    @Delete('/:id')
    @Serialize()
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successful response' })
    async removeUser(@Param('id') id: number) {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('removeUser', `Begin - Id: ${id}`, traceId);

        const res: ResponseWrapper<Boolean> = await this.usersService.delete(id, traceId);

        this.logger.debug('removeUser', `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - startTime).toFixed(0)}ms`, traceId);

        return res;
    }
}
