import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TodoEntity } from './entity/todos.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @Inject('TODO_REPOSITORY')
    private todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    try {
      const todoList = await this.todoRepository.find();
      return {
        status: {
          success: true,
          code: 200,
          message: 'Get All Data Successfuly',
        },
        data: todoList,
      };
    } catch (error) {
      throw new HttpException(
        'something want wrong!',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async findOne(id: string) {
    const objectId = new ObjectId(id);
    const todo = await this.todoRepository.findOne({
      where: { _id: objectId },
    });
    if (todo !== null) {
      return {
        status: {
          success: true,
          code: 200,
          message: 'Get Data Successfuly',
        },
        data: todo,
      };
    } else {
      throw new HttpException(
        `Todo with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createTodo(createTodoDto: CreateTodoDto) {
    createTodoDto.created_by = '1';
    createTodoDto.updated_by = null;
    const todoList = await this.todoRepository.create(createTodoDto);
    await this.todoRepository.save(todoList);
    return {
      status: {
        success: true,
        code: 201,
        message: 'Create Data Successfuly',
      },
      data: todoList,
    };
  }

  async updateTodo(id: string, updatedData: UpdateTodoDto) {
    const objectId = new ObjectId(id);
    const existingTodo = await this.todoRepository.findOne({
      where: { _id: objectId },
    });
    if (existingTodo !== null) {
      existingTodo.updated_by = existingTodo._id.toString();
      const updatedTodo = { ...existingTodo, ...updatedData };
      await this.todoRepository.save(updatedTodo);
      const newTodo = await this.todoRepository.findOne({
        where: { _id: objectId },
      });
      return {
        status: {
          success: true,
          code: 200,
          message: 'Get Data Successfuly',
        },
        data: newTodo,
      };
    } else {
      throw new HttpException(
        `Todo with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteTodo(id: string) {
    const objectId = new ObjectId(id);
    const todo = await this.todoRepository.findOne({
      where: { _id: objectId },
    });
    if (todo !== null) {
      await this.todoRepository.delete(id);
      return {
        status: {
          success: true,
          code: 200,
          message: 'Data Deleted Successfuly',
        },
      };
    } else {
      throw new HttpException(
        `Todo with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
