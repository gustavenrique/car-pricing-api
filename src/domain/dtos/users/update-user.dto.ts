import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    @ApiProperty({
        type: String,
        default: 'example@email.com',
    })
    email: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Plain Text Password',
        type: String,
        default: 'supersecurepassword',
    })
    password: string;
}
