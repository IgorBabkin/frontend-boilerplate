import { ApiClient } from '@ibabkin/backend-template';
import { Accessor } from '../di/utils';

export interface TodoDTO {
  id: string;
  name: string;
}

export interface UserDTO {
  nickname: string;
  permissions: Record<string, ('read' | 'write')[]>;
}

export const IApiClientKey = new Accessor<ApiClient>('IApiClient');
