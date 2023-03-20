/**
 * @fileoverview authentication pipe
 *
 * Pipes are responsible for:
 * - data validation
 * - data transformation
 *
 * @returns transformed value
 *
 * built-in pipes: https://docs.nestjs.com/pipes#built-in-pipes
 */

/** nestjs */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

/** providers */
import { CreateUserDto } from "src/users/dto/create-user.dto";

/** dependencies */
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthPipe implements PipeTransform<CreateUserDto> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) throw new BadRequestException("Validation failed");
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
