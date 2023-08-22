import { WinstonLogger } from 'src/cross-cutting/logging/winston.logger';
import { ReportsController } from 'src/controllers/reports.controller';
import { Report } from 'src/domain/entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { Module } from '@nestjs/common';
import { ReportsService } from 'src/services/reports.service';

@Module({
    imports: [TypeOrmModule.forFeature([Report]), UsersModule],
    controllers: [ReportsController],
    providers: [
        { provide: 'IReportsService', useClass: ReportsService },
        { provide: 'LoggerService', useClass: WinstonLogger },
    ],
})
export class ReportsModule {}
