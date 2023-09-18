import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Internal Server Error';

    if (error) {
      status = status;
      message = error.message;
    }

    response.status(status).json({
      status: {
        success: false,
        code: status,
        message: message,
      },
    });
  }
}
