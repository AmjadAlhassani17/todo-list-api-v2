import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { DatabaseModule } from 'src/database/database.module';
import { todoProviders } from './todos.providers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TodosController],
  providers: [TodosService, ...todoProviders],
})
export class TodosModule {}
