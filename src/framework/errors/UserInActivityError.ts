import { LogoutError } from '@context/errors/DomainError.ts';

export class UserInActivityError extends LogoutError {
  name = 'UserInActivityError';

  constructor(message = 'User is in activity') {
    super({ message, showLoginButton: true, closeSession: true });

    Object.setPrototypeOf(this, UserInActivityError.prototype);
  }
}
