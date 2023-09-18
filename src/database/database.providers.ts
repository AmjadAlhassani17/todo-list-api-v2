import { UserEntity } from 'src/auth/entity/auth.entity';
import { TodoEntity } from 'src/todos/entity/todos.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mongodb',
        host: '127.0.0.1',
        port: 27017,
        database: 'todoListDB',
        entities: [TodoEntity, UserEntity],
        synchronize: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      return dataSource.initialize();
    },
  },
];
