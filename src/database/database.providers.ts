import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 65432,
  username: 'postgres',
  password: '1234',
  database: 'bd_courses',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  /*synchronize: true,*/
  migrations: [],
});
