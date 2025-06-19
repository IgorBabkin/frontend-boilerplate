import { Observable } from 'rxjs';
import { AccessToken } from '@services/auth/IAuthProvider.ts';
import { depKey } from 'ts-ioc-container';

export interface IAuthStore {
  login(login: string, password: string): Promise<void>;

  logout(isSessionAlreadyClosed?: boolean): Promise<void>;

  refreshToken(): Promise<AccessToken>;

  accessToken$: Observable<string | undefined>;

  getTokenOrFail(): string;

  setToken(token: string): void;
}

export const IAuthStoreKey = depKey<IAuthStore>('IAuthStore');
