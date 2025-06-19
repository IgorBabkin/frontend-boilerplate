import { ApiClient } from '@ibabkin/backend-template';
import { depKey } from 'ts-ioc-container';

export interface TodoDTO {
  id: string;
  name: string;
}

export interface UserDTO {
  nickname: string;
  permissions: Record<string, ('read' | 'write')[]>;
}

export const IApiClientKey = depKey<ApiClient>('IApiClient');
