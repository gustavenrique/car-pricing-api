import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUID, randomUUID } from 'crypto';
import { ResponseWrapper, SwaggerResponse } from 'src/domain/dtos/response-wrapper';
import { CreateUserDto } from 'src/domain/dtos/users/create-user.dto';
import { UserDto } from 'src/domain/dtos/users/user.dto';
import { User } from 'src/domain/entities/user.entity';
import { Serialize } from 'src/interceptors/SerializeInterceptor';
import { WinstonLogger } from 'src/logging/winston.logger';
import { AuthService } from 'src/services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly logger: WinstonLogger) {}

    @Post('/signup')
    @Serialize(UserDto)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @SwaggerResponse(UserDto, { status: HttpStatus.CREATED, description: 'Successfull response' })
    async signup(@Body() body: CreateUserDto) {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('signup', `Begin - Email: ${body.email}`, traceId);

        const res: ResponseWrapper<User> = await this.authService.signup(body.email, body.password, traceId);

        this.logger.debug('signup', `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - startTime).toFixed(0)}ms`, traceId);

        return res;
    }

    @Post('/signin')
    @Serialize(UserDto)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK, description: 'Successfull response' })
    async signin(@Body() body: CreateUserDto) {
        const startTime: number = performance.now();

        const traceId: UUID = randomUUID();

        this.logger.debug('signin', `Begin - Email: ${body.email}`, traceId);

        const res: ResponseWrapper<User> = await this.authService.signin(body.email, body.password, traceId);

        this.logger.debug('signin', `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - startTime).toFixed(0)}ms`, traceId);

        return res;
    }
}
