import { provider, register, scope, singleton } from 'ts-ioc-container';
import { accessor } from '@lib/container/utils.ts';
import { Scope } from '@lib/scope/container.ts';
import { action } from '@lib/mediator/operations.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';

export interface IAuthService {
  login(): Promise<void>;
}

export const IAuthServiceKey = accessor<IAuthService>(Symbol('IAuthService'));

@register(IAuthServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class AuthService implements IAuthService {
  constructor() {} // @inject(IApiClientKey.resolve) private apiClientContext: Context<ApiClient>, // @inject(IAuthProviderKey.resolve) private authProvider: AuthProvider,

  @action
  async login(): Promise<void> {
    // const token = await this.authProvider.login('ironman@marvel.com', '12345');
    // this.apiClientContext.setValue(new ApiClient(token));
  }
}
