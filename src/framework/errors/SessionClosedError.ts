import { LogoutError } from '@context/errors/DomainError.ts';

export class SessionClosedError extends LogoutError {
  name = 'SessionClosedError';

  constructor(message: string) {
    super({ message, showLoginButton: true, closeSession: false });

    Object.setPrototypeOf(this, SessionClosedError.prototype);
  }
}
