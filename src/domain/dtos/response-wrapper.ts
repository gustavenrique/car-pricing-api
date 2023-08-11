import { ApiProperty } from '@nestjs/swagger';

export class ResponseWrapper<T> {
    constructor(status: number, message: string, data?: T) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public data: T;

    @ApiProperty()
    public message: string;

    @ApiProperty()
    public status: number;
}
