import { Exception } from '@helpers/exception.ts';

export class MissingAuthTokenException extends Exception {
  constructor(message: string) {
    super(message);
    this.name = 'MissingAuthTokenException';
  }
}
