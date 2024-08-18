import { LogoutError } from '@context/errors/LogoutError.ts';

export class SessionClosedError extends LogoutError {
  name = 'SessionClosedError';

  constructor(message: string) {
    super({ message, showLoginButton: true, isSessionAlreadyClosed: false });

    Object.setPrototypeOf(this, SessionClosedError.prototype);
  }
}
