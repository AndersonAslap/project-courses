import { IsNumber, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;
}

export class UpdateCourseFildsDto {
  @IsString()
  readonly name?: string;

  @IsString()
  readonly description?: string;

  @IsNumber()
  readonly price?: number;
}
