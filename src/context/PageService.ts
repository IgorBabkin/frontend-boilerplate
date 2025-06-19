import { Observable } from 'rxjs';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IPageContext, IPageService, IPageServiceKey } from '@context/IPageService.ts';
import { Store } from '@framework/service/Store.ts';

@register(IPageServiceKey, scope(Scope.application), singleton())
export class PageService extends Store implements IPageService {
  private context$ = new ObservableStore({ searchParams: new URLSearchParams(), urlParams: {} });

  getContext$(): Observable<IPageContext> {
    return this.context$.asObservable();
  }

  setContext(context: IPageContext): void {
    this.context$.next(context);
  }
}
