import { DomainError } from '@context/errors/DomainError.ts';

export class UserIsNotLoggedInError extends DomainError {
  name = 'UserIsNotLoggedInError';

  static match(e: unknown): e is UserIsNotLoggedInError {
    return e instanceof UserIsNotLoggedInError;
  }

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, UserIsNotLoggedInError.prototype);
  }
}
