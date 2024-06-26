import { Observable } from 'rxjs';
import { Params } from 'react-router-dom';
import { accessor } from '@lib/di/utils.ts';

export interface IPageContext {
  searchParams: URLSearchParams;
  urlParams: Readonly<Params>;
}

export interface IPageService {
  getContext$(): Observable<IPageContext>;

  setContext(context: IPageContext): void;
}

export const IPageServiceKey = accessor<IPageService>('IPageService');
