import { accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';
import { AccessToken } from '@services/auth/IAuthProvider.ts';

export interface IAuthStore {
  login(login: string, password: string): Promise<void>;

  logout(isSessionAlreadyClosed?: boolean): Promise<void>;

  refreshToken(): Promise<AccessToken>;

  accessToken$: Observable<string | undefined>;

  getTokenOrFail(): string;

  setToken(token: string): void;
}

export const IAuthStoreKey = accessor<IAuthStore>('IAuthStore');
