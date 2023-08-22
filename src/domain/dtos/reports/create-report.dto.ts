import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReportDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({
        default: 'Toyota',
    })
    make: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty({
        default: 'Corolla',
    })
    model: string;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    @ApiProperty({
        description: 'Price in US dollars',
        default: 21000,
    })
    price: number;

    @IsNumber()
    @Min(1920)
    @Max(2050)
    @ApiProperty({
        description: 'Year of manufacture',
        default: 2013,
    })
    year: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    @ApiProperty()
    mileage: number;

    @IsLatitude()
    @ApiProperty({
        description: "Latitude of where it's being sold",
        default: 28.49100021658984,
    })
    latitude: number;

    @IsLongitude()
    @ApiProperty({
        description: "Longitude of where it's being sold",
        default: -81.42469819508865,
    })
    longitude: number;
}
