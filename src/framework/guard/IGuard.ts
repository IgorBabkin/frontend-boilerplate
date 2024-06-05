export interface IGuard<TPayload = unknown> {
  execute(resource: TPayload, method: string): void;

  match?(payload: unknown): payload is TPayload;
}

export function matchPayload<TPayload>(command: IGuard<TPayload>, payload: unknown): payload is TPayload {
  return command.match ? command.match(payload) : true;
}
