import { Type, UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from 'src/controllers/interceptors/serialize.interceptor';

export const SerializeResponse = (dto?: Type) => UseInterceptors(new SerializeInterceptor<typeof dto>(dto));
