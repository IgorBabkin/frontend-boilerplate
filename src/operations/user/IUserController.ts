import { accessor } from '@lib/di/utils.ts';
import { Subscribable } from 'rxjs';
import { IUser } from '@services/user/IUser.ts';
import { type IUserService } from '@services/user/IUserService.public.ts';
import { by, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Controller } from '@framework/controller/Controller.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';

export interface IUserController {
  user$: Subscribable<IUser | null>;
}

export const IUserControllerKey = accessor<IUserController>('IUserController');

@provider(controller, singleton())
@register(IUserControllerKey.register, scope(Scope.application))
export class UserController extends Controller implements IUserController {
  user$: Subscribable<IUser | null>;

  constructor(
    @inject(by.scope.current) scope: IContainer,
    private userService: IUserService,
  ) {
    super(scope);
    this.user$ = this.userService.user$;
  }
}
