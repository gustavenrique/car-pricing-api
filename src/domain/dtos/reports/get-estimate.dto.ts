import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class GetEstimateDto {
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
    @Min(1920)
    @Max(2050)
    @ApiProperty({
        description: 'Year of manufacture',
        default: 2013,
    })
    @Transform(({ value }: { value: string }) => parseInt(value))
    year: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    @ApiProperty({ default: 0 })
    @Transform(({ value }: { value: string }) => parseInt(value))
    mileage: number;

    @IsLatitude()
    @ApiProperty({
        description: "Latitude of where it's being sold",
        default: 28.49100021658984,
    })
    @Transform(({ value }: { value: string }) => parseFloat(value))
    latitude: number;

    @IsLongitude()
    @ApiProperty({
        description: "Longitude of where it's being sold",
        default: -81.42469819508865,
    })
    @Transform(({ value }: { value: string }) => parseFloat(value))
    longitude: number;
}
