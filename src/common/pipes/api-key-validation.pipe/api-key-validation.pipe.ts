import { PipeTransform, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ApiKeyValidationPipe implements PipeTransform {
  transform(value: string) {
    if (value !== process.env.ADMIN_API_KEY) {
      throw new ForbiddenException('Invalid API_KEY');
    }
    return value;
  }
}
