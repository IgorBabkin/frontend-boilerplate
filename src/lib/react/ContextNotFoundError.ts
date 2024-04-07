export class ContextNotFoundError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ContextNotFoundError.prototype);
  }
}
