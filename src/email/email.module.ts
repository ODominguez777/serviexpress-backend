import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Exportamos el servicio para que pueda ser usado en otros módulos
})
export class EmailModule {}
