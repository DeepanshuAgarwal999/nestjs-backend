import {
  ArgumentMetadata,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { Schema } from 'joi';

export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error, value: validatedValue } = this.schema.validate(value);

    if (error) {
      throw new BadRequestException('Validation failed: ' + error.message);
    }

    return validatedValue;
  }
}
