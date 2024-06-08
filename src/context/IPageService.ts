import { Observable } from 'rxjs';
import { Params } from 'react-router-dom';
import { Accessor } from '@lib/di/utils.ts';

export interface IPageContext {
  searchParams: URLSearchParams;
  urlParams: Readonly<Params>;
}

export interface IPageService {
  getContext$(): Observable<IPageContext>;
}

export const IPageServiceKey = new Accessor<IPageService>('IPageService');
