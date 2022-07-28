import { HttpException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  private courses: Course[] = [];

  findAll() {
    return this.courses;
  }

  findOne(id: string) {
    const course = this.courses.find((course) => course.id === id);

    if (!course) {
      throw new HttpException('This course not found!', 404);
    }

    return course;
  }

  create(createCourseDto: CreateCourseDto) {
    const course = {
      id: String(this.courses.length + 1),
      active: true,
      ...createCourseDto,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.courses.push(course);
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    const indexCourse = this.courses.findIndex((course) => course.id === id);

    if (indexCourse) {
      const courseDataOld = this.courses.find((course) => course.id === id);

      const course = {
        id,
        active: true,
        ...updateCourseDto,
        created_at: courseDataOld.created_at,
        updated_at: new Date(),
      };

      console.log(course);

      this.courses[indexCourse] = course;
    }
  }

  delete(id: string) {
    const indexCourse = this.courses.findIndex((course) => course.id === id);
    if (indexCourse) this.courses.filter((course) => course.id !== id);
  }
}
