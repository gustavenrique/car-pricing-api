import { BadRequestException, MiddlewareConsumer, Module, RequestMethod, ValidationPipe } from '@nestjs/common';
import { CurrentUserMiddleware } from 'src/controllers/middlewares/current-user.middleware';
import { ResponseInteceptor } from 'src/controllers/interceptors/response.interceptor';
import { RequestMiddleware } from 'src/controllers/middlewares/request.middleware';
import { ReportsController } from 'src/controllers/reports.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadRequest } from 'src/domain/dtos/http-responses';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ReportsModule } from './reports.module';
import cookieSession = require('cookie-session');
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { databaseConfig } from '../../orm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRoot(databaseConfig),
        UsersModule,
        ReportsModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
                stopAtFirstError: true,
                exceptionFactory: (errors) => {
                    const error = errors[0];

                    const response = BadRequest(error.constraints[Object.keys(error.constraints)[0]]);

                    return new BadRequestException(response);
                },
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInteceptor,
        },
    ],
})
export class AppModule {
    constructor(private readonly config: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                RequestMiddleware,
                cookieSession({
                    name: 'user_session',
                    keys: [this.config.get<string>('COOKIE_KEY')],
                    maxAge: 60 * 60 * 1000, // 1 hour
                })
            )
            .forRoutes('*');

        consumer.apply(CurrentUserMiddleware).forRoutes({ path: 'auth/whoami', method: RequestMethod.GET }, ReportsController);
    }
}
