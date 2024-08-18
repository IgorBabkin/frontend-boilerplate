import { TokenError } from '@framework/errors/TokenError.ts';

export class EmptyTokenError extends TokenError {
  name = 'EmptyTokenError';

  static match(err: Error): err is EmptyTokenError {
    return err.name === 'EmptyTokenError';
  }

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, EmptyTokenError.prototype);
  }
}
