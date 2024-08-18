export interface IMiddleware<TPayload extends object = object> {
  execute(resource: TPayload, method: string): Promise<void> | void;

  match(resource: TPayload, method: string): boolean;
}

export function matchMiddleware<TPayload extends object = object>(
  command: IMiddleware<TPayload>,
  methodName: keyof IMiddleware,
  payload: unknown,
): payload is TPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return command.match ? command.match(payload as any, methodName) : true;
}
