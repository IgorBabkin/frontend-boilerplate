import { accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';
import { AccessToken } from '@services/auth/IAuthProvider.ts';

export interface IAuthService {
  isLoginVisible$: Observable<boolean>;

  closeAuthDialog(): void;

  login(login: string, password: string): Promise<void>;

  logout(closeSession?: boolean): Promise<void>;

  refreshToken(): Promise<AccessToken>;

  accessToken$: Observable<string | undefined>;

  getTokenOrFail(): string;

  setToken(token: string): void;

  showAuthDialog(): void;
}

export const IAuthServiceKey = accessor<IAuthService>('IAuthService');
