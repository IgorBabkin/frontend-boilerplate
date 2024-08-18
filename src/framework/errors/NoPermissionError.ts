export class NoPermissionError extends Error {
  name = 'NoPermissionError';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NoPermissionError.prototype);
  }
}
