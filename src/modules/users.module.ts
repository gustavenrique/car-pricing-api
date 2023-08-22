import { WinstonLogger } from 'src/cross-cutting/logging/winston.logger';
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';
import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthService } from 'src/services/auth.service';
import { User } from '../domain/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController, UsersController],
    providers: [
        { provide: 'IUsersService', useClass: UsersService },
        { provide: 'IAuthService', useClass: AuthService },
        { provide: 'LoggerService', useClass: WinstonLogger },
    ],
    exports: [{ provide: 'IUsersService', useClass: UsersService }],
})
export class UsersModule {}
