import { by, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { type IUserService, IUserServiceKey } from '@services/user/IUserService.public.ts';
import { Observable } from 'rxjs';
import { IUser } from '@services/user/IUser.ts';
import { IUserController, IUserControllerKey } from './IUserController.ts';
import { Controller } from '@framework/controller/Controller.ts';

@register(IUserControllerKey.register, scope(Scope.application))
@provider(controller, singleton())
export class UserInfoController extends Controller implements IUserController {
  constructor(
    @inject(IUserServiceKey.resolve) private userService: IUserService,
    @inject(by.scope.current) scope: IContainer,
  ) {
    super(scope);
  }

  getUser$(): Observable<IUser | undefined> {
    return this.userService.getUser$();
  }
}
