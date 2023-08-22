import { HttpStatus } from '@nestjs/common';
import { ResponseWrapper } from './response-wrapper';

export const Ok = <T>(message: string, response?: T) => new ResponseWrapper(HttpStatus.OK, message, response);

export const Created = <T>(message: string, response?: T) => new ResponseWrapper(HttpStatus.CREATED, message, response);

export const InternalServerError = <T>(message: string, response?: T) =>
    new ResponseWrapper(HttpStatus.INTERNAL_SERVER_ERROR, message, response);

export const BadRequest = <T>(message: string, response?: T) => new ResponseWrapper(HttpStatus.BAD_REQUEST, message, response);

export const NoContent = <T>(message: string, response?: T) => new ResponseWrapper(HttpStatus.NO_CONTENT, message, response);

export const Forbidden = <T>(message: string, response?: T) => new ResponseWrapper(HttpStatus.FORBIDDEN, message, response);

export const Unauthorized = <T>(message: string, response?: T) => new ResponseWrapper(HttpStatus.UNAUTHORIZED, message, response);
