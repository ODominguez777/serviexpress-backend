import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@ApiTags('Users')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get greeting' }) // Describe la operación del endpoint
  @ApiResponse({ status: 200, description: 'Saludo devuelto exitosamente.' }) // Respuesta esperada
  getHello(): string {
    return this.appService.getHello();
  }
}
