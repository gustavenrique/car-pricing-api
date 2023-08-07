import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Query, Req, UseInterceptors } from '@nestjs/common';
import { SwaggerResponse, ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/domain/dtos/users/update-user.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { WinstonLogger } from 'src/cross-cutting/logging/winston.logger';
import { UserDto } from 'src/domain/dtos/users/user.dto';
import { UsersService } from '../services/users.service';
import { User } from '../domain/entities/user.entity';
import { FullRequest } from 'src/controllers/interceptors/request.interceptor';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly logger: WinstonLogger) {}

    @Get()
    @Serialize(UserDto)
    @ApiQuery({ name: 'email', type: String, required: false })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK }, true)
    async getAllUsers(@Req() req: FullRequest, @Query('email') email?: string) {
        this.logger.debug('getAllUsers', `Begin${email ? ` - Email: ${email}` : ''}`, req.traceId);

        const res: ResponseWrapper<User[]> = await this.usersService.getAll(email, req.traceId);

        this.logger.debug(
            'getAllUsers',
            `End - Amount of users returned: ${res?.data?.length} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Get('/:id')
    @Serialize(UserDto)
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK })
    async getUser(@Req() req: FullRequest, @Param('id') id: number) {
        this.logger.debug('getUser', `Begin - Id: ${id}`, req.traceId);

        const res: ResponseWrapper<User> = await this.usersService.get(id, req.traceId);

        this.logger.debug(
            'getUser',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Patch('/:id')
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateUserDto })
    @Serialize(UserDto)
    @SwaggerResponse(UserDto, { status: HttpStatus.OK })
    async updateUser(@Req() req: FullRequest, @Param('id') id: number, @Body() body: UpdateUserDto) {
        this.logger.debug('updateUser', `Begin - Id: ${id}`, req.traceId);

        const res: ResponseWrapper<User> = await this.usersService.update(id, body, req.traceId);

        this.logger.debug(
            'updateUser',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Delete('/:id')
    @Serialize()
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successful response' })
    async removeUser(@Req() req: FullRequest, @Param('id') id: number) {
        this.logger.debug('removeUser', `Begin - Id: ${id}`, req.traceId);

        const res: ResponseWrapper<Boolean> = await this.usersService.delete(id, req.traceId);

        this.logger.debug(
            'removeUser',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }
}
