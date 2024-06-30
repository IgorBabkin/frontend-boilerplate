import { WindowOperationLog } from './OperationLog.ts';
import { IContainer, parseTagsPath } from 'ts-ioc-container';

export class TimeTravel {
  private logs: WindowOperationLog[] = [];

  constructor(private scope: IContainer) {}

  setLogs(logs: WindowOperationLog[]) {
    this.logs = logs;
  }

  async replay(timeFrom: number): Promise<void> {
    const [first, ...rest] = this.logs.filter((l) => l.createdAt >= timeFrom);
    let current: WindowOperationLog | undefined = first;
    const startTime = Date.now();
    const currentTime = () => Date.now() - startTime;
    while (current) {
      if (current.createdAt > currentTime()) {
        continue;
      }

      const scope = this.scope.findScopeByPath(parseTagsPath(current.path), (s, tags) =>
        tags.every((t) => s.hasTag(t)),
      );
      if (!scope) {
        throw new Error(`Cannot find scope with path ${current.path}`);
      }
      await current.execute(scope);
      current = rest.shift();
    }
  }
}
