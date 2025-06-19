import { AuthClient, IAuthClientKey } from './AuthClient.ts';
import { inject, MethodNotImplementedError, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthError } from '@lib/api/mapApiToDomainError.ts';
import { Scope } from '@framework/scope.ts';
import { AccessToken, AuthCredentials, IAuthProvider, IAuthProviderKey } from '@services/auth/IAuthProvider.ts';

@register(IAuthProviderKey, scope(Scope.application), singleton())
export class AuthProvider implements IAuthProvider {
  constructor(@inject(IAuthClientKey.resolve) private authClient: AuthClient) {}

  @mapAuthError
  async authenticate({ username, password }: AuthCredentials): Promise<AccessToken> {
    const token = await this.authClient.login(username, password);
    return token as AccessToken;
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
