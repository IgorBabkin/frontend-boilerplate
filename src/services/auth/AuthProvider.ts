import { AuthClient, IAuthClientKey } from './AuthClient.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthError } from '@lib/api/mapApiToDomainError.ts';
import { Scope } from '@framework/scope.ts';
import { accessor } from '@lib/di/utils.ts';

export const IAuthProviderKey = accessor<AuthProvider>('IAuthProvider');

@register(IAuthProviderKey.register, scope(Scope.application))
@provider(singleton())
export class AuthProvider {
  constructor(@inject(IAuthClientKey.resolve) private authClient: AuthClient) {}

  @mapAuthError
  async login(email: string, password: string): Promise<string> {
    return await this.authClient.login(email, password);
  }
}
