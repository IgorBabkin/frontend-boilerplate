export interface IAsyncCommand {
  execute(...args: unknown[]): Promise<void>;
}
