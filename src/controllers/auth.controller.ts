import { Body, Controller, Get, HttpStatus, Inject, LoggerService, Post, Req, Session, UseGuards } from '@nestjs/common';
import { SerializeResponse } from 'src/controllers/decorators/serialize-response';
import { SwaggerResponse } from 'src/controllers/decorators/swagger-response';
import { IAuthService } from 'src/services/interfaces/auth.service.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { AuthUserDto } from 'src/domain/dtos/users/auth-user.dto';
import { CookieSession } from 'src/domain/dtos/cookie-session';
import { FullRequest } from 'src/domain/dtos/full-request';
import { UserDto } from 'src/domain/dtos/users/user.dto';
import { User } from 'src/domain/entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject('IAuthService') private readonly authService: IAuthService,
        @Inject('LoggerService') private readonly logger: LoggerService
    ) {}

    @Post('/signup')
    @SerializeResponse(UserDto)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @SwaggerResponse(UserDto, { status: HttpStatus.CREATED, description: 'Successfull response' })
    async signup(@Req() req: FullRequest, @Body() body: AuthUserDto, @Session() session: CookieSession) {
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
    @SerializeResponse(UserDto)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK, description: 'Successfull response' })
    async signin(@Req() req: FullRequest, @Body() body: AuthUserDto, @Session() session: CookieSession) {
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
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async signOut(@Req() req: FullRequest, @Session() session: CookieSession) {
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
    @SerializeResponse(UserDto)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ResponseWrapper })
    @SwaggerResponse(UserDto, { status: HttpStatus.OK })
    async whoAmI(@Req() req: FullRequest) {
        this.logger.debug('whoAmI', `Begin`, req.traceId);

        const res: ResponseWrapper<User> = new ResponseWrapper(HttpStatus.OK, 'User returned successfully', req.currentUser);

        this.logger.debug(
            'whoAmI',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }
}
