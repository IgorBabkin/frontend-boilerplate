import { LogoutError } from '@context/errors/LogoutError.ts';

export class UserInActivityError extends LogoutError {
  name = 'UserInActivityError';

  constructor(message = 'User is in activity') {
    super({ message, showLoginButton: true, isSessionAlreadyClosed: true });

    Object.setPrototypeOf(this, UserInActivityError.prototype);
  }
}
