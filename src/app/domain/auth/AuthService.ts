import { AuthClient, IAuthClientKey } from '../../api/AuthClient.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { mapAuthToDomainError } from '../../api/mapApiToDomainError.ts';
import { Scope } from '../../../lib/scope/container.ts';
import { accessor } from '../../../lib/container/utils.ts';

export const IAuthServiceKey = accessor<AuthService>(Symbol('IAuthService'));

@register(IAuthServiceKey.register)
@provider(scope(Scope.application), singleton())
export class AuthService {
  constructor(@inject(IAuthClientKey.resolve) private authClient: AuthClient) {}

  @mapAuthToDomainError
  async login(email: string, password: string): Promise<string> {
    return await this.authClient.login(email, password);
  }
}
