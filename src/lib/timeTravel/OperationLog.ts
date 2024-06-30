import { IContainer } from 'ts-ioc-container';

export type OperationLog = {
  key: string;
  path: string;
  methodName: string;
  payload: string;
  createdAt: number;
};

export class WindowOperationLog implements OperationLog {
  constructor(
    public key: string,
    public path: string,
    public methodName: string,
    public payload: string,
    public createdAt: number,
  ) {}

  async execute(scope: IContainer) {
    const operation = scope.resolve(this.key);
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    await operation[this.methodName](...JSON.parse(this.payload));
  }
}

export const logOperation =
