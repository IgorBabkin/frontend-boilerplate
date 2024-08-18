import { DomainError } from '@context/errors/DomainError.ts';

export abstract class TokenError extends DomainError {
  static match(e: Error): e is TokenError {
    return e instanceof TokenError;
  }

  protected constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, TokenError.prototype);
  }
}
