import { DomainError } from '../../context/errors/DomainError';

export class PermissionError extends DomainError {
  name = 'PermissionError';

  static assert(isTrue: boolean, failMassage: string) {
    if (!isTrue) {
      throw new PermissionError(failMassage);
    }
  }

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}
