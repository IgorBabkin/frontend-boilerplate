import type { IContainer } from 'ts-ioc-container';
import { initialize } from '@framework/hooks/OnInit.ts';
import { IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { Service } from '@framework/service/Service.ts';

export abstract class Controller {
  private errorService: IErrorService;
  protected initializables: Service[] = [];

  protected constructor(private scope: IContainer) {
    this.errorService = IErrorServiceKey.resolve(scope);
  }

  async initAsync(): Promise<void> {
    await Promise.all(
      Object.values(this)
        .filter((i: unknown) => i instanceof Service)
        .concat(this.initializables)
        .map(async (s) => {
          try {
            await initialize(s, this.scope);
          } catch (e) {
            this.errorService.throwError(e as Error);
          }
        }),
    );
  }
}
