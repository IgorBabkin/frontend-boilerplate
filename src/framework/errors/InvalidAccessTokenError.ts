import { TokenError } from '@framework/errors/TokenError.ts';

export class InvalidAccessTokenError extends TokenError {
  name = 'InvalidAccessTokenError';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidAccessTokenError.prototype);
  }
}
