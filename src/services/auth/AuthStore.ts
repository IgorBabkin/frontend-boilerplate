import { inject, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IAuthStore, IAuthStoreKey } from './IAuthStore.ts';
import { BehaviorSubject } from 'rxjs';
import { AccessToken, type IAuthProvider, IAuthProviderKey } from '@services/auth/IAuthProvider.ts';
import { MissingTokenError } from '@framework/errors/MissingTokenError.ts';
import { Store } from '@framework/service/Store.ts';

@register(IAuthStoreKey, scope(Scope.application), singleton())
export class AuthStore extends Store implements IAuthStore {
  accessToken$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(@inject(IAuthProviderKey.resolve) private authProvider: IAuthProvider) {
    super();
  }

  async login(login: string, password: string): Promise<void> {
    const token = await this.authProvider.authenticate(login, password);
    this.accessToken$.next(token);
  }

  async logout(isSessionAlreadyClosed?: boolean): Promise<void> {
    if (this.accessToken$.getValue() === undefined) {
      return;
    }

    this.accessToken$.next(undefined);
    if (!isSessionAlreadyClosed) {
      await this.authProvider.closeSession();
    }
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
      throw new MissingTokenError('Token is not present');
    }
    return token;
  }
}
