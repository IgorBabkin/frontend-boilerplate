import { by, inject, register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IErrorService, IErrorServiceKey } from './IErrorService.public.ts';
import { Exception } from '@helpers/exception.ts';
import { toPromise } from '@lib/utils.ts';
import { IExceptionHandler, IExceptionHandlerKey } from '@framework/errors/IExceptionHandler.ts';

@register(IErrorServiceKey.asKey, scope(Scope.application))
export class ErrorService implements IErrorService {
  constructor(@inject(by.many(IExceptionHandlerKey)) private handlers: IExceptionHandler[]) {}

  async handleError(error: unknown): Promise<void> {
    if (!(error instanceof Exception)) {
      throw error;
    }

    let handlers = [...this.handlers];
    while (handlers.length) {
      const h = handlers.shift()!;
      try {
        await toPromise(h.handle(error as Exception));
      } catch (e) {
        if (!(e instanceof Exception)) {
          throw e;
        }
        error = e;
        handlers = [...this.handlers];
      }
    }
  }
}
