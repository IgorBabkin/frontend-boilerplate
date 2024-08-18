import { AuthClient, IAuthClientKey } from './AuthClient.ts';
import { inject, MethodNotImplementedError, provider, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthError } from '@lib/api/mapApiToDomainError.ts';
import { Scope } from '@framework/scope.ts';
import { AccessToken, IAuthProvider, IAuthProviderKey } from '@services/auth/IAuthProvider.ts';

@register(IAuthProviderKey.register, scope(Scope.application))
@provider(singleton())
export class AuthProvider implements IAuthProvider {
  constructor(@inject(IAuthClientKey.resolve) private authClient: AuthClient) {}

  @mapAuthError
  async authenticate(username: string, password: string): Promise<AccessToken> {
    return await this.authClient.login(username, password);
  }

  @mapAuthError
  async refreshToken(): Promise<AccessToken> {
    throw new MethodNotImplementedError('refreshToken');
  }

  @mapAuthError
  async closeSession(): Promise<void> {
    throw new MethodNotImplementedError('closeSession');
  }
}
