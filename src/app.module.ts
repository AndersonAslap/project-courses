import { Module } from '@nestjs/common';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [CoursesModule],
})
export class AppModule { }
