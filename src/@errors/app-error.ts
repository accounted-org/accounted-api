import { HttpException, HttpStatus } from '@nestjs/common';
import { APP_ERRORS, ErrorEntry } from './index';

export class AppError extends HttpException {
  constructor(ERROR?: ErrorEntry) {
    const error = ERROR ?? APP_ERRORS.SERVER_ERROR;

    super(
      {
        code: ERROR?.code ?? APP_ERRORS.SERVER_ERROR.code,
      },
      error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
