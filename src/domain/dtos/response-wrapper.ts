import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

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

export const SwaggerResponse = <DataDto extends Type<unknown>>(dataDto: DataDto, options?: ApiResponseOptions, dtoInArray?: Boolean) => {
    const data = dtoInArray
        ? {
              type: 'array',
              items: { $ref: getSchemaPath(dataDto) },
          }
        : {
              $ref: getSchemaPath(dataDto),
          };

    return applyDecorators(
        ApiExtraModels(ResponseWrapper, dataDto),
        ApiResponse({
            ...options,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ResponseWrapper) },
                    {
                        properties: {
                            data,
                        },
                    },
                ],
            },
        })
    );
};
