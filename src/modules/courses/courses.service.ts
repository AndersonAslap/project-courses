import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  private courses: Course[] = [];

  constructor(
    @Inject('COURSES_REPOSITORY')
    private readonly courseRepository: Repository<Course>,
  ) { }

  findAll() {
    return this.courseRepository.find();
  }

  findOne(id: string) {
    const course = this.courseRepository.findOne({ where: { id: id } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
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
