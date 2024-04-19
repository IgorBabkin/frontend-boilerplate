import { AuthClient, IAuthClientKey } from '../../api/AuthClient.ts';
import { inject, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthError } from '../../api/mapApiToDomainError.ts';
import { Scope } from '@lib/scope/container.ts';
import { accessor } from '@lib/container/utils.ts';

export const IAuthProviderKey = accessor<AuthProvider>(Symbol('IAuthProvider'));

@register(IAuthProviderKey.register, scope(Scope.application), singleton())
export class AuthProvider {
  constructor(@inject(IAuthClientKey.resolve) private authClient: AuthClient) {}

  @mapAuthError
  async login(email: string, password: string): Promise<string> {
    return await this.authClient.login(email, password);
  }
}
