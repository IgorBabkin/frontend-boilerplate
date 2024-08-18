import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IAuthService, IAuthServiceKey } from './IAuthService.public';
import { BehaviorSubject } from 'rxjs';
import { AccessToken, type IAuthProvider, IAuthProviderKey } from '@services/auth/IAuthProvider.ts';
import { EmptyTokenError } from '@services/auth/EmptyTokenError.ts';
import { Service } from '@framework/service/Service.ts';

@provider(singleton())
@register(IAuthServiceKey.register, scope(Scope.application))
export class AuthService extends Service implements IAuthService {
  isLoginVisible$ = new BehaviorSubject<boolean>(true);
  accessToken$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(@inject(IAuthProviderKey.resolve) private authProvider: IAuthProvider) {
    super();
  }

  async login(login: string, password: string): Promise<void> {
    const token = await this.authProvider.authenticate(login, password);
    this.accessToken$.next(token);
    this.isLoginVisible$.next(false);
  }

  async logout(server?: boolean): Promise<void> {
    this.accessToken$.next(undefined);
    this.isLoginVisible$.next(true);
    if (server) {
      await this.authProvider.closeSession();
    }
  }

  closeAuthDialog(): void {
    this.isLoginVisible$.next(false);
  }

  refreshToken(): Promise<AccessToken> {
    return this.authProvider.refreshToken();
  }

  async setToken(token: string): Promise<void> {
    this.accessToken$.next(token);
  }

  getTokenOrFail(): string {
    const token = this.accessToken$.getValue();
    if (!token) {
      throw new EmptyTokenError('Token is not present');
    }
    return token;
  }

  showAuthDialog() {
    this.isLoginVisible$.next(true);
  }
}
