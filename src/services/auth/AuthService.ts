import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { service } from '@framework/service/ServiceProvider.ts';
import { IAuthService, IAuthServiceKey } from './IAuthService.public';

@register(IAuthServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class AuthService implements IAuthService {
  constructor() {} // @inject(IApiClientKey.resolve) private apiClientContext: Context<ApiClient>, // @inject(IAuthProviderKey.resolve) private authProvider: AuthProvider,

  async login(): Promise<void> {
    // const token = await this.authProvider.login('ironman@marvel.com', '12345');
    // this.apiClientContext.setValue(new ApiClient(token));
  }
}
