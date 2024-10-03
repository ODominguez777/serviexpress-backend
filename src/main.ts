import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  // Configura el ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas en el DTO
    })
  );

  //Swagger Config
  setupSwagger(app);

  await app.listen(process.env.PORT);
}
bootstrap();
