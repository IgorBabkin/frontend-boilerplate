import { DomainError } from '../errors/DomainError';

export class UnauthorizedError extends DomainError {
  name = 'UnauthorizedError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
