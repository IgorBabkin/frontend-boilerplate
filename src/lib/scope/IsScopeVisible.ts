import { combineLatest, map, Observable } from 'rxjs';
import { IObservableQuery } from '../mediator/ICommand.ts';
import { inject } from 'ts-ioc-container';
import { byAliases } from './container.ts';

export class IsScopeVisible implements IObservableQuery<void, boolean> {
  constructor(@inject(byAliases.loaderPredicate) private predicates: IObservableQuery<void, boolean>[] = []) {}

  create(): Observable<boolean> {
    const obs$ = this.predicates.map((predicate) => predicate.create());
    return combineLatest(obs$).pipe(map((obs) => obs.some((value) => value)));
  }
}
