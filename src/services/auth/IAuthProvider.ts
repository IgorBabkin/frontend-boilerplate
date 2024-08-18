import { accessor } from '@lib/di/utils.ts';
import { AuthProvider } from '@services/auth/AuthProvider.ts';

export const IAuthProviderKey = accessor<AuthProvider>('IAuthProvider');

export type AccessToken = string;

export interface IAuthProvider {
  authenticate(username: string, password: string): Promise<AccessToken>;

  refreshToken(): Promise<AccessToken>;

  closeSession(): Promise<void>;
}
