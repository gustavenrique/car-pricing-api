import { UUID } from 'crypto';
import { CreateReportDto } from 'src/domain/dtos/reports/create-report.dto';
import { GetEstimateDto } from 'src/domain/dtos/reports/get-estimate.dto';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { Report } from 'src/domain/entities/report.entity';
import { User } from 'src/domain/entities/user.entity';

export interface IReportsService {
    create(report: CreateReportDto, user: User, traceId: UUID): Promise<ResponseWrapper<Report>>;
    update(id: number, props: Partial<Report>, traceId: UUID): Promise<ResponseWrapper<Report>>;
    getEstimate(estimateDto: GetEstimateDto, traceId: UUID): Promise<ResponseWrapper<number>>;
}
