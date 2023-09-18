import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.todosService.findOne(id);
  }

  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto) {
    return await this.todosService.createTodo(createTodoDto);
  }

  @Put(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updatedData: UpdateTodoDto,
  ) {
    return await this.todosService.updateTodo(id, updatedData);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    return await this.todosService.deleteTodo(id);
  }
}
