import { LogoutError, LogoutReason } from '@context/errors/DomainError.ts';

export class TabsLogoutError extends LogoutError {
  constructor(reason: LogoutReason) {
    super(reason);

    Object.setPrototypeOf(this, TabsLogoutError.prototype);
  }
}
