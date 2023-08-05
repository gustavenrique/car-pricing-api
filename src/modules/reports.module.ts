import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from 'src/controllers/reports.controller';
import { Report } from 'src/domain/entities/report.entity';
import { ReportsService } from 'src/services/reports.service';

@Module({
    imports: [TypeOrmModule.forFeature([Report])],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {}
