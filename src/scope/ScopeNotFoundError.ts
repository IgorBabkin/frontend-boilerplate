export class ScopeNotFoundError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ScopeNotFoundError.prototype);
  }
}
