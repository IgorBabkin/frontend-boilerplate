import { accessor } from '../../lib/di/utils';

export interface IAuthService {
  login(): Promise<void>;
}

export const IAuthServiceKey = accessor<IAuthService>('IAuthService');
