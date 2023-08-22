import { UUID } from 'crypto';
import { ResponseWrapper } from '../../domain/dtos/response-wrapper';
import { User } from '../../domain/entities/user.entity';

export interface IAuthService {
    signup(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>>;
    signin(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>>;
}
