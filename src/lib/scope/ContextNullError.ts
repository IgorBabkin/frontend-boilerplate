import { DomainError } from '@domain/errors/DomainError.ts';

export class ContextNullError extends DomainError {
  name = 'ContextNullError';

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, ContextNullError.prototype);
  }
}
