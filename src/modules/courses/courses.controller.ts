import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';

const courses = [];

@Controller('courses')
export class CoursesController {
  @Get()
  findAll(@Res() response) {
    return response.status(200).json(courses);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return courses.find((course) => course.id === id);
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  create(@Body() body) {
    const course = { id: String(courses.length + 1), ...body };
    courses.push(course);
  }
}
