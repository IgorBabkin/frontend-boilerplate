import { Accessor } from '../lib/di/utils';
import { Observable } from 'rxjs';
import { Params } from 'react-router-dom';

export interface IPageContext {
  searchParams: URLSearchParams;
  urlParams: Readonly<Params>;
}

export const IPageContextKey = new Accessor<Observable<IPageContext>>('IPageContext');
