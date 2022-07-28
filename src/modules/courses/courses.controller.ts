import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesServices: CoursesService) { }

  @Get()
  findAll() {
    return this.coursesServices.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesServices.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  create(@Body() body) {
    this.coursesServices.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    this.coursesServices.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    this.coursesServices.delete(id);
  }
}
