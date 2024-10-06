// src/decorators/header.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const Header = createParamDecorator(
  (headerName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headerValue = request.headers[headerName.toLowerCase()];
    if (headerValue === undefined) {
      throw new BadRequestException(`Header "${headerName}" is missing`);
    }
    return headerValue;
  }
);
