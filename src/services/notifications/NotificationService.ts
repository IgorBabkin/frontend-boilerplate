import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { filter, Observable, switchMap, timer } from 'rxjs';
import { isPresent } from '@lib/utils.ts';

import { execute, onStartAsync } from '@framework/hooks/OnInit';
import { INotificationService, INotificationServiceKey } from './INotificationService.public';
import { service } from '@framework/service/ServiceProvider.ts';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';

@register(INotificationServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class NotificationService implements INotificationService {
  private messages$ = new ObservableStore<string | undefined>(undefined);

  showMessage(message: string) {
    this.messages$.setValue(message);
  }

  getMessage$(): Observable<string | undefined> {
    return this.messages$.asObservable();
  }

  @onStartAsync(execute())
  hideMessageOnTimeout() {
    return this.messages$
      .asObservable()
      .pipe(
        filter(isPresent),
        switchMap(() => timer(5000)),
      )
      .subscribe(() => this.messages$.setValue(undefined));
  }
}
