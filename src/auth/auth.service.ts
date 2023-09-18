import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserEntity } from './entity/auth.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Users_REPOSITORY')
    private authRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async findOne(email: string) {
    return await this.authRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOneById(_id: ObjectId) {
    return await this.authRepository.findOne({
      where: {
        _id,
      },
    });
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const checkEmail = await this.findOne(registerUserDto.email);

    if (checkEmail !== null) {
      throw new HttpException(
        `User with email ${registerUserDto.email} is found!`,
        HttpStatus.FOUND,
      );
    }

    const salt = await bcrypt.genSalt(10);
    registerUserDto.password = await bcrypt.hash(
      registerUserDto.password,
      salt,
    );

    const createUserDto = await this.authRepository.create({
      ...registerUserDto,
      role: 'user',
    });

    await this.authRepository.save(createUserDto);

    const jwtPayload = {
      _id: createUserDto._id,
      email: registerUserDto.email,
      role: 'user',
    };
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1d',
      algorithm: 'HS512',
    });

    const userData = { ...createUserDto, token };

    return {
      status: {
        success: true,
        code: 201,
        message: 'User Register Successfuly',
      },
      data: userData,
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const checkEmail = await this.findOne(loginUserDto.email);

    if (checkEmail === null) {
      throw new HttpException(
        `User with email ${loginUserDto.email} is not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    const user = checkEmail;

    const isPasswordCorrect = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        `Invalid Email or Password`,
        HttpStatus.FORBIDDEN,
      );
    }

    const jwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const jwtToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1d',
      algorithm: 'HS512',
    });

    const userData = { ...user, jwtToken };

    return {
      status: {
        success: true,
        code: 200,
        message: 'User Login Successfuly',
      },
      data: userData,
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new HttpException(`Invalid token`, HttpStatus.UNAUTHORIZED);
    }
  }

  async updateUser(
    currentUser: string,
    userId: string,
    updateUserDto: UpdateUserDto,
  ) {
    const objectId = new ObjectId(userId);
    const user = await this.findOneById(objectId);

    if (user === null) {
      throw new HttpException(
        `User with email ${updateUserDto.email} is not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (currentUser !== userId) {
      throw new HttpException(
        'You are not authorized to update this account.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updatedTodo = { ...user, ...updateUserDto };
    await this.authRepository.save(updatedTodo);
    const newUser = await this.authRepository.findOne({
      where: { _id: objectId },
    });

    return {
      status: {
        success: true,
        code: 200,
        message: 'Update User Successfuly',
      },
      data: newUser,
    };
  }

  async deleteUser(currentUser: string, userId: string) {
    const objectId = new ObjectId(userId);
    const user = await this.authRepository.findOne({
      where: { _id: objectId },
    });

    if (user === null) {
      throw new HttpException(
        `User with id ${userId} is not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (currentUser !== userId) {
      throw new HttpException(
        'You are not authorized to delete this account.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.authRepository.delete(userId);

    return {
      status: {
        success: true,
        code: 200,
        message: 'User deleted Successfuly',
      },
    };
  }
}
