import { IContainer, serializeTagsPath, TagPath } from 'ts-ioc-container';

export type CommandLog = {
  key: string;
  tagPath: TagPath;
  methodName: string;
  payload: unknown[];
  createdAt: number;
};

export class CommandExecuter {
  constructor(public scope: IContainer) {}

  async execute(log: CommandLog) {
    const currentScope = this.scope.findScopeByPath([...log.tagPath], (scope, tags) =>
      tags.every((t) => scope.hasTag(t)),
    );
    if (!currentScope) {
      throw new Error(`Cannot find scope with path ${serializeTagsPath(log.tagPath)}`);
    }
    const operation = currentScope.resolve(log.key);
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    await operation[this.methodName](this.payload);
  }
}
