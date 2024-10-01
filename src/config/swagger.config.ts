import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('ServiExpress')
    .setDescription('This is the documentation of the ServiExpress application')
    .setVersion('1.0')
    .addTag('Users', 'Endpoints related to user operations')
    .addTag('Services', 'Endpoints related to service management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
