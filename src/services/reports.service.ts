import { CreateReportDto } from 'src/domain/dtos/reports/create-report.dto';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { Report } from 'src/domain/entities/report.entity';
import { IReportsService } from './interfaces/reports.service.interface';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { UUID } from 'crypto';
import { BadRequest, Created, InternalServerError, NoContent, Ok } from 'src/domain/dtos/http-responses';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/entities/user.entity';
import { GetEstimateDto } from 'src/domain/dtos/reports/get-estimate.dto';

@Injectable()
export class ReportsService implements IReportsService {
    constructor(
        @InjectRepository(Report) private readonly repo: Repository<Report>,
        @Inject('LoggerService') private readonly logger: LoggerService
    ) {}

    async create(reportModel: CreateReportDto, user: User, traceId: UUID): Promise<ResponseWrapper<Report>> {
        try {
            const report: Report = await this.repo.create(reportModel);

            report.user = user;

            const result = await this.repo.save(report);

            if (!result) return InternalServerError('An unexpected error occurred');

            return Created('Report created successfully', result);
        } catch (error) {
            this.logger.error('signup', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }

    async update(id: number, props: Partial<Report>, traceId: UUID): Promise<ResponseWrapper<Report>> {
        try {
            if (!id) return BadRequest('Must provide ReportID');

            let report = await this.repo.findOne({ where: { id } });

            if (!report) return NoContent('Report not found');

            Object.assign(report, props);

            const updatedReport: Report = await this.repo.save(report);

            if (!updatedReport) return InternalServerError('An unexpected error occurred');

            return Ok('Report updated successfully', updatedReport);
        } catch (error) {
            this.logger.error('update', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }

    async getEstimate(estimateDto: GetEstimateDto, traceId: UUID): Promise<ResponseWrapper<number>> {
        try {
            const result: { price?: number } = await this.repo
                .createQueryBuilder()
                .select('AVG(price)', 'price')
                .where(
                    `
                    make = :make
                    AND model = :model
                    AND (longitude - :longitude BETWEEN -5 AND 5)
                    AND (latitude - :latitude BETWEEN -5 AND 5)
                    AND (year - :year BETWEEN -3 AND 3)
                    AND approved IS TRUE
                `
                )
                .orderBy('ABS(mileage - :mileage)', 'DESC')
                .setParameters(estimateDto)
                .limit(3)
                .getRawOne();

            if (!result.price) return NoContent('Unable to estimate a price for the provided car');

            return Ok('Price estimated successfully', result.price);
        } catch (error) {
            this.logger.error('getEstimate', error, traceId);

            return InternalServerError('An unexpected error occurred');
        }
    }
}
