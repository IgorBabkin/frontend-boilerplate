import { Observable } from 'rxjs';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IPageContext, IPageService, IPageServiceKey } from '@context/IPageService.ts';
import { Service } from '@framework/service/Service.ts';

@register(IPageServiceKey.register, scope(Scope.application))
@provider(singleton())
export class PageService extends Service implements IPageService {
  private context$ = new ObservableStore({ searchParams: new URLSearchParams(), urlParams: {} });

  getContext$(): Observable<IPageContext> {
    return this.context$.asObservable();
  }

  setContext(context: IPageContext): void {
    this.context$.next(context);
  }
}
