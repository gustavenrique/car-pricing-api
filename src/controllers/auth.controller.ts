import { Body, Controller, Get, HttpStatus, Post, Req, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseWrapper, SwaggerResponse } from 'src/domain/dtos/response-wrapper';
import { CurrentUserInterceptor } from 'src/controllers/interceptors/current-user.interceptor';
import { AuthUserDto } from 'src/domain/dtos/users/auth-user.dto';
import { FullRequest } from 'src/controllers/interceptors/request.interceptor';
import { Serialize } from 'src/controllers/interceptors/serialize.interceptor';
import { WinstonLogger } from 'src/cross-cutting/logging/winston.logger';
import { UserDto } from 'src/domain/dtos/users/user.dto';
import { AuthService } from 'src/services/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domain/entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly logger: WinstonLogger) {}

    @Post('/signup')
    @Serialize(UserDto)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @SwaggerResponse(UserDto, { status: HttpStatus.CREATED, description: 'Successfull response' })
    async signup(@Req() req: FullRequest, @Body() body: AuthUserDto, @Session() session: any) {
        this.logger.debug('signup', `Begin - Email: ${body.email}`, req.traceId);

        const res: ResponseWrapper<User> = await this.authService.signup(body.email, body.password, req.traceId);

        session.userId = res.data?.id;

        this.logger.debug(
            'signup',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Post('/signin')
    @Serialize(UserDto)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK, description: 'Successfull response' })
    async signin(@Req() req: FullRequest, @Body() body: AuthUserDto, @Session() session: any) {
        this.logger.debug('signin', `Begin - Email: ${body.email}`, req.traceId);

        const res: ResponseWrapper<User> = await this.authService.signin(body.email, body.password, req.traceId);

        session.userId = res.data?.id;

        this.logger.debug(
            'signin',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Post('/signout')
    @Serialize()
    @ApiResponse({ status: HttpStatus.NO_CONTENT, schema: { example: new ResponseWrapper(0, '', true) } })
    async signOut(@Req() req: FullRequest, @Session() session: any) {
        this.logger.debug('logout', `Begin`, req.traceId);

        session.userId = null;

        const res = new ResponseWrapper(HttpStatus.NO_CONTENT, 'User logged out successfully', true);

        this.logger.debug(
            'logout',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Get('/whoami')
    @Serialize(UserDto)
    @UseGuards(AuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ResponseWrapper<UserDto> })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper<UserDto> })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK })
    async whoAmI(@Req() req: FullRequest) {
        this.logger.debug('whoAmI', `Begin`, req.traceId);

        const res: ResponseWrapper<User> = req.currentUser
            ? new ResponseWrapper(HttpStatus.OK, 'User returned successfully', req.currentUser)
            : new ResponseWrapper(HttpStatus.FORBIDDEN, 'Not logged in');

        this.logger.debug(
            'whoAmI',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }
}
