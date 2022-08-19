import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends CreateCourseDto {}

export class UpdateCourseFildsDto extends PartialType(CreateCourseDto) {}
