export interface IAsyncCommand {
  execute(): Promise<void>;
}
