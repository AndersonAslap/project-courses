import { Body, Controller, Get, Param, Post } from '@nestjs/common';

const courses = [];

@Controller('courses')
export class CoursesController {
  @Get()
  findAll() {
    return courses;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return courses.find((course) => course.id === id);
  }

  @Post()
  create(@Body() body) {
    const course = { id: String(courses.length + 1), ...body };
    courses.push(course);
    return course;
  }
}
