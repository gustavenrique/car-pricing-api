import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';

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
