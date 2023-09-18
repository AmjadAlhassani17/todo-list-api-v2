import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFilter } from './exceptions/all-exceptions.filter';
import { LoggingInterceptor } from './Interceptors/logging.interceptor';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';

dotenv.config();
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.setGlobalPrefix('api/v1');
  await app.listen(port);
  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
