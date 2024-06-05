import { DomainError } from './DomainError';

export class UnknownError extends DomainError {
  name = 'UnknownError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
