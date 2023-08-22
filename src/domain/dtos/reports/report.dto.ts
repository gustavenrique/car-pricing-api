import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../users/user.dto';
import { Expose, Transform } from 'class-transformer';
import { Report } from 'src/domain/entities/report.entity';

export class ReportDto {
    @ApiProperty({ default: 1 })
    @Expose()
    public id: number;

    @ApiProperty({
        description: 'Price in US dollars',
        default: 21000,
    })
    @Expose()
    public price: number;

    @ApiProperty({ default: 'Toyota' })
    @Expose()
    public make: string;

    @ApiProperty({ default: 'Corolla' })
    @Expose()
    public model: string;

    @ApiProperty({
        description: 'Year of manufacture',
        default: 2013,
    })
    @Expose()
    public year: number;

    @ApiProperty({
        description: "Latitude of where it's being sold",
        default: 28.49100021658984,
    })
    @Expose()
    public latitude: number;

    @ApiProperty({
        description: "Longitude of where it's being sold",
        default: -81.42469819508865,
    })
    @Expose()
    public longitude: number;

    @ApiProperty()
    @Expose()
    public mileage: number;

    @ApiProperty({ required: false })
    @Expose()
    @Transform(({ obj: report }: { obj: Report }) => report.user?.id)
    public user_id: number;
}
