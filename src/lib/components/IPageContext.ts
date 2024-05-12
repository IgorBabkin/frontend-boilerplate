import { accessor } from '@lib/container/utils.ts';
import { Observable } from 'rxjs';
import { Params } from 'react-router-dom';

export interface IPageContext {
  searchParams: URLSearchParams;
  urlParams: Readonly<Params>;
}

export const IPageContextKey = accessor<Observable<IPageContext>>(Symbol('IPageContext'));
