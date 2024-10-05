import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { AuthModule } from './users/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    EmailModule,
    AuthModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
