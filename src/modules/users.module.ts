import { CurrentUserInterceptor } from 'src/controllers/interceptors/current-user.interceptor';
import { WinstonLogger } from 'src/cross-cutting/logging/winston.logger';
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';
import { UsersService } from '../services/users.service';
import { AuthService } from 'src/services/auth.service';
import { User } from '../domain/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController, UsersController],
    providers: [
        { provide: 'IUsersService', useClass: UsersService },
        { provide: 'IAuthService', useClass: AuthService },
        { provide: 'LoggerService', useClass: WinstonLogger },
        CurrentUserInterceptor,
    ],
})
export class UsersModule {}
