import { TokenError } from '@framework/errors/TokenError.ts';

export class MissingTokenError extends TokenError {
  name = 'MissingTokenError';

  static match(err: Error): err is MissingTokenError {
    return err.name === 'MissingTokenError';
  }

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, MissingTokenError.prototype);
  }
}
