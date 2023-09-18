import { DataSource } from 'typeorm';
import { UserEntity } from './entity/auth.entity';

export const authProviders = [
  {
    provide: 'Users_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];
