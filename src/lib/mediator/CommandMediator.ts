import { IMediator } from './IMediator.ts';
import { SimpleMediator } from './SimpleMediator.ts';
import { ScopedMediator } from './ScopedMediator.ts';
import { by, type IContainer, inject, key, provider, register, singleton } from 'ts-ioc-container';

@register(key('ICommandMediator'))
@provider(singleton())
export class CommandMediator extends ScopedMediator {
  protected scopes: string[] = ['request'];

  constructor(@inject(by.scope.current) scope: IContainer) {
    super(scope);
  }

  protected createMediator(scope: IContainer): IMediator {
    return new SimpleMediator(scope);
  }
}
