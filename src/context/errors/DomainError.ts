export abstract class DomainError extends Error {
  protected constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export type LogoutReason = {
  message: string;
  showLoginButton: boolean;
  closeSession: boolean;
};

export abstract class LogoutError extends DomainError {
  static match(e: Error): e is LogoutError {
    return e instanceof LogoutError;
  }

  protected constructor(public logoutReason: LogoutReason) {
    super(logoutReason.message);

    Object.setPrototypeOf(this, LogoutError.prototype);
  }
}
