import { setupSwagger } from './config/swagger.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Swagger Config
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
