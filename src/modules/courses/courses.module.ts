import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { DatabaseModule } from 'src/database/database.module';
import { courseProviders } from './courses.providers';
import { tagProviders } from './tags.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CoursesController],
  providers: [CoursesService, ...courseProviders, ...tagProviders],
})
export class CoursesModule { }
