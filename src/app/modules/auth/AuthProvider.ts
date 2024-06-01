import { AuthClient, IAuthClientKey } from '@core/api/AuthClient';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthError } from '@core/api/mapApiToDomainError';
import { Scope } from '@framework/scope/container';
import { accessor } from '@core/container/utils';

export const IAuthProviderKey = accessor<AuthProvider>(Symbol('IAuthProvider'));

@register(IAuthProviderKey.register, scope(Scope.application))
@provider(singleton())
export class AuthProvider {
  constructor(@inject(IAuthClientKey.resolve) private authClient: AuthClient) {}

  @mapAuthError
  async login(email: string, password: string): Promise<string> {
    return await this.authClient.login(email, password);
  }
}
