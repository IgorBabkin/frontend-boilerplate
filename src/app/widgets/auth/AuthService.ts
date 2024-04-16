import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { AuthProvider, IAuthProviderKey } from '@domain/auth/AuthProvider.ts';
import { Context } from '@lib/scope/Context.ts';
import { ApiClient, IApiClientKey } from '../../api/ApiClient.ts';
import { accessor } from '@lib/container/utils.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { Scope } from '@lib/scope/container.ts';
import { action } from '@lib/mediator/ICommand.ts';

export interface IAuthService {
  login(): Promise<void>;
}

export const IAuthServiceKey = accessor<IAuthService>(Symbol('IAuthService'));

@register(IAuthServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class AuthService implements IAuthService {
  constructor(
    @inject(IAuthProviderKey.resolve) private authProvider: AuthProvider,
    @inject(IApiClientKey.resolve) private apiClientContext: Context<ApiClient>,
  ) {}

  @action
  async login(): Promise<void> {
    const token = await this.authProvider.login('ironman@marvel.com', '12345');
    this.apiClientContext.setValue(new ApiClient(token));
  }
}
