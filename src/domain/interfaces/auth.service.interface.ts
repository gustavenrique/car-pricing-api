import { UUID } from 'crypto';
import { ResponseWrapper } from '../dtos/response-wrapper';
import { User } from '../entities/user.entity';

export interface IAuthService {
    signup(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>>;
    signin(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>>;
}
