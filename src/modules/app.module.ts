import { RequestInterceptor } from 'src/controllers/interceptors/request.interceptor';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Report } from '../domain/entities/report.entity';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { User } from '../domain/entities/user.entity';
import { Log } from '../domain/entities/log.entity';
import { ReportsModule } from './reports.module';
import cookieSession = require('cookie-session');
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'sqlite',
                database: config.get<string>('DB_NAME'),
                synchronize: true,
                entities: [User, Report, Log],
            }),
        }),
        UsersModule,
        ReportsModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useValue: new RequestInterceptor(),
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                cookieSession({
                    keys: ['42$#$djwj@r3rSSAe23q'],
                })
            )
            .forRoutes('*');
    }
}
