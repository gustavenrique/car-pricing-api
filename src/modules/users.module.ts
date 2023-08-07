import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { WinstonLogger } from 'src/cross-cutting/logging/winston.logger';
import { AuthService } from 'src/services/auth.service';
import { CurrentUserInterceptor } from 'src/controllers/interceptors/current-user.interceptor';

@Module({
    imports: [TypeOrmModule.forFeature([User])], // that's what creates the repository automagically
    controllers: [AuthController, UsersController],
    providers: [UsersService, AuthService, WinstonLogger, CurrentUserInterceptor],
})
export class UsersModule {}
