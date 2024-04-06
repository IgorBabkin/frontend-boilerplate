import { DomainError } from '../errors/DomainError.ts';

export class PermissionError extends DomainError {
  name = 'PermissionError';

  static assert(isTrue: boolean, failMassage: string) {
    if (!isTrue) {
      throw new PermissionError(failMassage);
    }
  }
}
