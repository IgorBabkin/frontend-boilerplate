import { alias, inject, provider, register, scope, setMethodMetadata, singleton } from 'ts-ioc-container';
import { CommandAlias, Scope } from '@framework/scope.ts';
import { type IAuthService, IAuthServiceKey } from '@services/auth/IAuthService.public.ts';
import { IMiddleware } from '@framework/guard/IMiddleware.ts';
import { middleware } from '@framework/middleware/MiddlewareProvider.ts';
import { getMethodMetadata } from 'ts-ioc-container/typings/metadata';
import { Controller } from '@framework/controller/Controller.ts';

@register(scope(Scope.application))
@provider(middleware, singleton(), alias(CommandAlias.onAfterExecution))
export class RefreshToken implements IMiddleware<Controller> {
  constructor(@inject(IAuthServiceKey.resolve) private authService: IAuthService) {}

  match(resource: Controller, method: string): boolean {
    return getMethodMetadata('refreshToken', resource, method) !== undefined;
  }

  async execute(): Promise<void> {
    await this.authService.refreshToken();
  }
}

export const refreshToken = setMethodMetadata('refreshToken', true);
