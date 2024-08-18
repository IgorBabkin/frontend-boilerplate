export class EmptyTokenError extends Error {
  name = 'EmptyTokenError';

  static match(err: Error): err is EmptyTokenError {
    return err.name === 'EmptyTokenError';
  }

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, EmptyTokenError.prototype);
  }
}
