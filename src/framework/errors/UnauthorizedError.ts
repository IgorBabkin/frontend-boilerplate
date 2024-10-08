import { DomainError } from '@context/errors/DomainError.ts';

export class UnauthorizedError extends DomainError {
  name = 'UnauthorizedError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
