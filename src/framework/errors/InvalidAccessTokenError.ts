import { DomainError } from '@context/errors/DomainError.ts';

export class InvalidAccessTokenError extends DomainError {
  name = 'InvalidAccessTokenError';
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidAccessTokenError.prototype);
  }
}
