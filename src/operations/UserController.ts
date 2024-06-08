import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { type IUserService, IUserServiceKey } from '@services/user/IUserService.public.ts';
import { query } from '@framework/controller/metadata.ts';
import { Observable } from 'rxjs';
import { IUser } from '@services/user/IUser.ts';
import { IUserController, IUserControllerKey } from './IUserController.ts';

@register(IUserControllerKey.register, scope(Scope.application))
@provider(controller, singleton())
export class UserController implements IUserController {
  constructor(@inject(IUserServiceKey.resolve) private userService: IUserService) {}

  @query getUser$(): Observable<IUser | undefined> {
    return this.userService.getUser$();
  }
}
