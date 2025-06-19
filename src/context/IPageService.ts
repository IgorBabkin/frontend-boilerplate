import { Observable } from 'rxjs';
import { Params } from 'react-router-dom';
import { depKey } from 'ts-ioc-container';

export interface IPageContext {
  searchParams: URLSearchParams;
  urlParams: Readonly<Params>;
}

export interface IPageService {
  getContext$(): Observable<IPageContext>;

  setContext(context: IPageContext): void;
}

export const IPageServiceKey = depKey<IPageService>('IPageService');
