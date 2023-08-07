import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { ReportsModule } from './reports.module';
import { User } from '../domain/entities/user.entity';
import { Report } from '../domain/entities/report.entity';
import { WinstonLogger } from '../cross-cutting/logging/winston.logger';
import { Log } from '../domain/entities/log.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [User, Report, Log], // the automagically created/updated tables
            synchronize: true, // it enables automatic migrations
        }),
        UsersModule,
        ReportsModule,
    ],
    providers: [WinstonLogger],
})
export class AppModule {}
