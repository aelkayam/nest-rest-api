import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  All,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch(HttpException)
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const MyResponseObj: MyResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      MyResponseObj.statusCode = exception.getStatus();
      MyResponseObj.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      MyResponseObj.statusCode = 422;
      MyResponseObj.response = exception.message.replace(/\n/g, '');
    } else {
      MyResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      MyResponseObj.response = 'Internal Server Error';
    }

    response.status(MyResponseObj.statusCode).json(MyResponseObj);
    this.logger.error(MyResponseObj.response, AllExceptionsFilter.name);

    super.catch(exception, host);
  }
}
