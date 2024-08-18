import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IAuthService, IAuthServiceKey } from './IAuthService.public';
import { BehaviorSubject } from 'rxjs';
import { AccessToken, type IAuthProvider, IAuthProviderKey } from '@services/auth/IAuthProvider.ts';
import { EmptyTokenError } from '@services/auth/EmptyTokenError.ts';
import { Service } from '@framework/service/Service.ts';
import { type LogoutReason } from '@context/errors/DomainError.ts';

@provider(singleton())
@register(IAuthServiceKey.register, scope(Scope.application))
export class AuthService extends Service implements IAuthService {
  isAuthDialogVisible$ = new BehaviorSubject<boolean>(true);
  accessToken$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(@inject(IAuthProviderKey.resolve) private authProvider: IAuthProvider) {
    super();
  }

  async login(login: string, password: string): Promise<void> {
    const token = await this.authProvider.authenticate(login, password);
    this.accessToken$.next(token);
    this.isAuthDialogVisible$.next(false);
  }

  async logout(reason: LogoutReason): Promise<void> {
    if (this.accessToken$.getValue() === undefined) {
      return;
    }

    this.accessToken$.next(undefined);
    this.isAuthDialogVisible$.next(true);

    if (reason.closeSession) {
      await this.authProvider.closeSession();
    }
  }

  closeAuthDialog(): void {
    this.isAuthDialogVisible$.next(false);
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
}
