import { AuthClient, IAuthClientKey } from '../../api/AuthClient.ts';
import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthToDomainError } from '../../api/mapApiToDomainError.ts';
import { Scope } from '../../../lib/scope/container.ts';

export const IAuthServiceKey = Symbol('IAuthService');

@register(key(IAuthServiceKey))
@provider(scope(Scope.application), singleton())
export class AuthService {
  constructor(@inject(by.key(IAuthClientKey)) private authClient: AuthClient) {}

  @mapAuthToDomainError
  async login(email: string, password: string): Promise<string> {
    return await this.authClient.login(email, password);
  }
}
