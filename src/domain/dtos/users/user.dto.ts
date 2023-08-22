import { ApiProperty } from '@nestjs/swagger';
import { ReportDto } from '../reports/report.dto';
import { Expose } from 'class-transformer';

export class UserDto {
    @Expose()
    @ApiProperty()
    public id: number;

    @Expose()
    @ApiProperty()
    public email: string;

    @Expose()
    @ApiProperty()
    public active: boolean;

    @Expose()
    @ApiProperty()
    public admin: boolean;

    @Expose()
    @ApiProperty({ required: false })
    public reports?: ReportDto[];
}
