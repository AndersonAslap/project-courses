import { Module } from '@nestjs/common';
import { CoursesModule } from './modules/courses/courses.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [CoursesModule, DatabaseModule],
})
export class AppModule {}
