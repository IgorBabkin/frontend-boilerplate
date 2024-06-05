import { AuthClient, IAuthClientKey } from '../../lib/api/AuthClient';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthError } from '../../lib/api/mapApiToDomainError';
import { Scope } from '@framework/scope.ts';
import { Accessor } from '../../lib/di/utils';

export const IAuthProviderKey = new Accessor<AuthProvider>('IAuthProvider');

@register(IAuthProviderKey.register, scope(Scope.application))
@provider(singleton())
export class AuthProvider {
  constructor(@inject(IAuthClientKey.resolve) private authClient: AuthClient) {}

  @mapAuthError
  async login(email: string, password: string): Promise<string> {
    return await this.authClient.login(email, password);
  }
}
