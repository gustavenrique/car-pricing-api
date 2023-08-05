import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
    @Expose()
    @ApiProperty()
    public id: number;

    @Expose()
    @ApiProperty()
    public email: string;
}
