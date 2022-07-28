import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';

type CourseType = {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

let courses: CourseType[] = [];

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
    const course = {
      id: String(courses.length + 1),
      active: true,
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    } as CourseType;
    courses.push(course);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body, @Res() response) {
    const course = courses.find((course) => course.id === id);
    const index = courses.indexOf(course);
    const courseUpdated = {
      id,
      ...body,
      created_at: course.created_at,
      updated_at: new Date(),
    };
    courses[index] = courseUpdated;
    return response.status(200).json(courseUpdated);
  }

  @Patch('active/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  active(@Param('id') id: string) {
    const course = courses.find((course) => course.id === id);
    const index = courses.indexOf(course);

    courses[index].active = true;
  }

  @Patch('desactive/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  desactive(@Param('id') id: string) {
    const course = courses.find((course) => course.id === id);
    const index = courses.indexOf(course);

    courses[index].active = false;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    courses = courses.filter((course) => course.id !== id);
  }
}
