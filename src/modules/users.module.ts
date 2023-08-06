import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { WinstonLogger } from 'src/logging/winston.logger';
import { AuthService } from 'src/services/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])], // that's what creates the repository automagically
    controllers: [AuthController, UsersController],
    providers: [UsersService, AuthService, WinstonLogger],
})
export class UsersModule {}
