import { Subscribable } from 'rxjs';
import { IUser } from '@services/user/IUser.ts';
import { type IUserStore } from '@services/user/IUserService.public.ts';
import { by, depKey, type IContainer, inject, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Controller } from '@framework/controller/Controller.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';

export interface IUserController {
  user$: Subscribable<IUser | null>;
}

export const IUserControllerKey = depKey<IUserController>('IUserController');

@register(IUserControllerKey, scope(Scope.application), controller(), singleton())
export class UserController extends Controller implements IUserController {
  user$: Subscribable<IUser | null>;

  constructor(
    @inject(by.scope.current) scope: IContainer,
    private userService: IUserStore,
  ) {
    super(scope);
    this.user$ = this.userService.user$;
  }
}
