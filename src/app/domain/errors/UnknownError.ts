import { DomainError } from './DomainError.ts';

export class UnknownError extends DomainError {
  name = 'UnknownError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
