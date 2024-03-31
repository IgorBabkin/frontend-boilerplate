import { BehaviorSubject } from 'rxjs';
import { key, provider, register, scope, singleton } from 'ts-ioc-container';

@register(key('ITodoStore'))
@provider(singleton(), scope((c) => c.hasTag('application')))
export class TodoStore {
  items$ = new BehaviorSubject<string[]>([]);
}
