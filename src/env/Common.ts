import { IContainer, IContainerModule, Registration as R, scope, singleton } from 'ts-ioc-container';
import { IErrorBusKey } from '../app/domain/errors/ErrorBus.ts';
import { TodoStore } from '../app/domain/todo/TodoStore.ts';
import { UserStore } from '../app/domain/user/UserStore.ts';
import { Subject } from 'rxjs';
import { CommandMediator } from '../lib/mediator/CommandMediator.ts';
import { CheckPermission } from '../app/widgets/auth/CheckPermission.ts';
import { ErrorHandler } from '../app/domain/errors/IErrorHandler.ts';
import { TodoRepo } from '../app/domain/todo/TodoRepo.ts';
import { hasTags } from '../lib/scope/container.ts';
import { UserRepo } from '../app/domain/user/UserRepo.ts';
import { AuthClient, IAuthClientKey } from '../app/api/AuthClient.ts';
import { Context } from '../lib/scope/Context.ts';
import { AuthService } from '../app/domain/auth/AuthService.ts';
import { ApiClient, IApiClientKey } from '../app/api/ApiClient.ts';
import { TodoController } from '../app/widgets/todo/TodoController.ts';
import { UserController } from '../app/widgets/auth/UserController.ts';
import { ErrorController } from '../app/widgets/errors/ErrorController.ts';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(R.fromValue(new Subject()).to(IErrorBusKey))
      .use(R.fromClass(TodoStore))
      .use(R.fromClass(UserStore))
      .use(R.fromClass(CommandMediator))
      .use(R.fromClass(CheckPermission))
      .use(R.fromClass(ErrorHandler))
      .use(R.fromClass(TodoRepo))
      .use(R.fromClass(UserRepo))
      .use(R.fromClass(AuthService))
      .use(R.fromClass(TodoController))
      .use(R.fromClass(UserController))
      .use(R.fromClass(ErrorController))
      .use(R.fromValue(new Context(new ApiClient('someToken'))).to(IApiClientKey))
      .use(
        R.fromClass(AuthClient)
          .to(IAuthClientKey)
          .pipe(scope(hasTags.every('application')), singleton()),
      );
  }
}
