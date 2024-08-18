import { DomainError } from '@context/errors/DomainError.ts';

export type LogoutReason = {
  message: string;
  showLoginButton: boolean;
  isSessionAlreadyClosed: boolean;
};

export abstract class LogoutError extends DomainError {
  static match(e: Error): e is LogoutError {
    return e instanceof LogoutError;
  }

  protected constructor(public logoutReason?: LogoutReason) {
    super(logoutReason?.message);

    Object.setPrototypeOf(this, LogoutError.prototype);
  }
}
