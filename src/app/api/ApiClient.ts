import { accessor } from '@lib/container/utils.ts';
import { ApiClient } from '@ibabkin/backend-template';

export interface TodoDTO {
  id: string;
  name: string;
}

export interface UserDTO {
  nickname: string;
  permissions: Record<string, ('read' | 'write')[]>;
}

export const IApiClientKey = accessor<ApiClient>(Symbol('IApiClient'));
