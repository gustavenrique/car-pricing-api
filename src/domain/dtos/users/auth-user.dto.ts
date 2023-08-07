import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthUserDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        default: 'example@email.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        description: 'Plain Text Password',
        type: String,
        default: 'incrediblysecurepassword',
    })
    password: string;
}
