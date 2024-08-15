import { CommandLog, CommandExecuter } from './CommandLog.ts';

export class LogPlayer {
  private commands: CommandLog[] = [];

  constructor(private commandExecuter: CommandExecuter) {}

  setLogs(logs: CommandLog[]): this {
    this.commands = logs;
    return this;
  }

  replay(timeFrom: number): () => number {
    const [first, ...rest] = this.commands.filter((l) => l.createdAt >= timeFrom);
    let command: CommandLog | undefined = first;

    const startTime = Date.now();
    const seek = () => Date.now() - startTime;
    let isReplaying = true;
    const abort = () => {
      isReplaying = false;
      return seek();
    };

    while (isReplaying && command) {
      if (command.createdAt < seek()) {
        void this.commandExecuter.execute(command);
        command = rest.shift();
      }
    }

    return abort;
  }
}
