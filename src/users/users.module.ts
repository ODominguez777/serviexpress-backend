import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import { ValidationService } from './validation/validation.service';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ValidationService],
})
export class UsersModule {}
