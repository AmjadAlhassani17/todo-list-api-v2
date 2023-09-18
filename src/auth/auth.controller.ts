import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from './entity/auth.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { TokenVerificationMiddleware } from 'src/middlewares/token-verification.middleware';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() registerDto: RegisterUserDto) {
    return await this.authService.registerUser(registerDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Put('updateUser/:id')
  @UseGuards(TokenVerificationMiddleware, JwtAuthGuard, RolesGuard)
  @Roles('user')
  async updateUser(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.authService.updateUser(
      user._id.toString(),
      id,
      updateUserDto,
    );
  }

  @Delete('deleteUser/:id')
  @UseGuards(TokenVerificationMiddleware, JwtAuthGuard, RolesGuard)
  @Roles('user')
  async deleteUser(@CurrentUser() user: UserEntity, @Param('id') id: string) {
    return await this.authService.deleteUser(user._id.toString(), id);
  }
}
