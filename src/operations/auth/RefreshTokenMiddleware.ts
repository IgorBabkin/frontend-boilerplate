import { inject, register, scope, setMethodMetadata, singleton } from 'ts-ioc-container';
import { CommandAlias, Scope } from '@framework/scope.ts';
import { type IAuthStore, IAuthStoreKey } from '@services/auth/IAuthStore.ts';
import { IMiddleware } from '@framework/guard/IMiddleware.ts';
import { middleware } from '@framework/middleware/MiddlewareProvider.ts';
import { getMethodMetadata } from 'ts-ioc-container/typings/metadata';
import { Controller } from '@framework/controller/Controller.ts';

@register(scope(Scope.application), middleware(), singleton(), CommandAlias.onAfterExecution)
export class RefreshTokenMiddleware implements IMiddleware<Controller> {
  constructor(@inject(IAuthStoreKey.resolve) private authService: IAuthStore) {}

  match(resource: Controller, method: string): boolean {
    return getMethodMetadata('refreshToken', resource, method) !== undefined;
  }

  async execute(): Promise<void> {
    await this.authService.refreshToken();
  }
}

export const refreshToken = setMethodMetadata('refreshToken', true);
