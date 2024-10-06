/* eslint-disable */
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  app.useGlobalFilters(new AllExceptionsFilter());

  // Configura el ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //Swagger Config
  setupSwagger(app);

  app
    .getHttpAdapter()
    .get('/', (req: express.Request, res: express.Response) => {
      res.send('¡Hola Mundo!');
    });
  await app.listen(process.env.PORT);
}
bootstrap();
