import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;

  @IsBoolean()
  readonly active?: boolean;

  @IsString({ each: true })
  readonly tags: string[];
}
