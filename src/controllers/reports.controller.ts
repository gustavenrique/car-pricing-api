import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Inject,
    LoggerService,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { SerializeResponse } from 'src/controllers/decorators/serialize-response';
import { IReportsService } from 'src/services/interfaces/reports.service.interface';
import { SwaggerResponse } from 'src/controllers/decorators/swagger-response';
import { ApproveReportDto } from 'src/domain/dtos/reports/approve-report.dto';
import { CreateReportDto } from 'src/domain/dtos/reports/create-report.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { ReportDto } from 'src/domain/dtos/reports/report.dto';
import { Report } from 'src/domain/entities/report.entity';
import { FullRequest } from 'src/domain/dtos/full-request';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { GetEstimateDto } from 'src/domain/dtos/reports/get-estimate.dto';

@ApiBearerAuth()
@ApiTags('reports')
@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
    constructor(
        @Inject('IReportsService') private readonly reportsService: IReportsService,
        @Inject('LoggerService') private readonly logger: LoggerService
    ) {}

    @Post()
    @SerializeResponse(ReportDto)
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ResponseWrapper })
    @SwaggerResponse(ReportDto, { status: HttpStatus.CREATED })
    async create(@Req() req: FullRequest, @Body() body: CreateReportDto) {
        this.logger.debug('create', `Begin - Request: ${JSON.stringify(body)}`, req.traceId);

        const res: ResponseWrapper<Report> = await this.reportsService.create(body, req.currentUser, req.traceId);

        this.logger.debug(
            'create',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        type: ResponseWrapper,
        description: 'Must provide the required request object props',
    })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, type: ResponseWrapper, description: 'Report not found' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ResponseWrapper, description: 'Must be signed in' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ResponseWrapper, description: 'Must be an admin' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @SwaggerResponse(ReportDto, { status: HttpStatus.OK })
    async update(@Param('id') id: number, @Body() body: ApproveReportDto, @Req() req: FullRequest) {
        this.logger.debug('update', `Begin - Request: ${JSON.stringify(body)}`, req.traceId);

        const res: ResponseWrapper<Report> = await this.reportsService.update(id, body, req.traceId);

        this.logger.debug(
            'update',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }

    @Get('/estimate-price')
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Unable to estimate a price for the given car' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ResponseWrapper })
    @ApiResponse({ status: HttpStatus.OK, type: ResponseWrapper<number> })
    async getEstimate(@Query() params: GetEstimateDto, @Req() req: FullRequest) {
        this.logger.debug('getEstimate', `Begin - Request: ${JSON.stringify(params)}`, req.traceId);

        const res: ResponseWrapper<number> = await this.reportsService.getEstimate(params, req.traceId);

        this.logger.debug(
            'getEstimate',
            `End - Response: ${JSON.stringify(res)} - Time: ${(performance.now() - req.startTime).toFixed(0)}ms`,
            req.traceId
        );

        return res;
    }
}
