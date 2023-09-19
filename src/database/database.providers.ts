import { UserEntity } from 'src/auth/entity/auth.entity';
import { TodoEntity } from 'src/todos/entity/todos.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mongodb',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_DATABASE_NAME,
        entities: [TodoEntity, UserEntity],
        synchronize: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      return dataSource.initialize();
    },
  },
];
