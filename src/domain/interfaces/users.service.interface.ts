import { User } from '../entities/user.entity';
import { ResponseWrapper } from '../dtos/response-wrapper';
import { UUID } from 'crypto';

export interface IUsersService {
    create(email: string, password: string, traceId: UUID): Promise<ResponseWrapper<User>>;
    getAll(email: string, traceId: UUID): Promise<ResponseWrapper<User[]>>;
    get(id: number, traceId: UUID): Promise<ResponseWrapper<User>>;
    update(id: number, props: Partial<User>, traceId: UUID): Promise<ResponseWrapper<User>>;
    delete(id: number, traceId: UUID): Promise<ResponseWrapper<Boolean>>;
}
