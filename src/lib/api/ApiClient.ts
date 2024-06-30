import { ApiClient } from '@ibabkin/backend-template';
import { accessor } from '../di/utils';

export interface TodoDTO {
  id: string;
  name: string;
}

export interface UserDTO {
  nickname: string;
  permissions: Record<string, ('read' | 'write')[]>;
}

export const IApiClientKey = accessor<ApiClient>('IApiClient');
