import { accessor } from '@lib/container/utils.ts';

export interface IPageContext {
  status: 'active' | 'completed';
}

export const IPageContextKey = accessor<IPageContext>(Symbol('IPageContext'));
