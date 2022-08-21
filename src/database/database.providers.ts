import { DataSource } from 'typeorm';
import { CreateTableCourse1661004211433 } from './migrations/1661004211433-CreateTableCourse';
import { CreateTableTag1661004223152 } from './migrations/1661004223152-CreateTableTag';
import { CreateTableCourseTag1661004736107 } from './migrations/1661004736107-CreateTableCourseTag';
import { AddCoursesIdToCoursesTagsTable1629406086494 } from './migrations/1661123017876-AddCoursesIdToCoursesTagsTable';
import { AddTagsIdToCoursesTagsTable1629406641111 } from './migrations/1661123298474-AddTagsIdToCoursesTagsTable';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'cursonestjs',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [
    CreateTableCourse1661004211433,
    CreateTableTag1661004223152,
    CreateTableCourseTag1661004736107,
    AddCoursesIdToCoursesTagsTable1629406086494,
    AddTagsIdToCoursesTagsTable1629406641111,
  ],
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
