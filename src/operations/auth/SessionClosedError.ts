import { DomainError } from '@context/errors/DomainError.ts';

export class SessionClosedError extends DomainError {
  name = 'SessionClosedError';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, SessionClosedError.prototype);
  }
}
