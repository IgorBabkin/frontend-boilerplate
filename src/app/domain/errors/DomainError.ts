export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
