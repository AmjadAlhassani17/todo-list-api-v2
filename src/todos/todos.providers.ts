import { DataSource } from 'typeorm';
import { TodoEntity } from './entity/todos.entity';

export const todoProviders = [
  {
    provide: 'TODO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TodoEntity),
    inject: ['DATA_SOURCE'],
  },
];
