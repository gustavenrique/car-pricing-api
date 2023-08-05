import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { WinstonLogger } from 'src/logging/winston.logger';

@Module({
    imports: [TypeOrmModule.forFeature([User])], // that's what creates the repository automagically
    controllers: [UsersController],
    providers: [UsersService, WinstonLogger],
})
export class UsersModule {}
