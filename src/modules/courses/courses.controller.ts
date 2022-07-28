import { Controller, Get, Param } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  @Get()
  findAll() {
    return 'list all courses';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `list one course - id : ${id}`;
  }
}
