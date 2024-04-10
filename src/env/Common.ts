import { IContainer, IContainerModule, Registration as R, scope, singleton } from 'ts-ioc-container';
import { IErrorBusKey } from '../app/domain/errors/ErrorBus.ts';
import { TodoStore } from '../app/domain/todo/TodoStore.ts';
import { UserStore } from '../app/domain/user/UserStore.ts';
import { Subject } from 'rxjs';
import { ServiceMediator } from '../lib/mediator/ServiceMediator.ts';
import { CheckPermission } from '../app/widgets/auth/CheckPermission.ts';
import { ErrorHandler } from '../app/domain/errors/IErrorHandler.ts';
import { TodoRepo } from '../app/domain/todo/TodoRepo.ts';
import { hasTags } from '../lib/scope/container.ts';
import { UserRepo } from '../app/domain/user/UserRepo.ts';
import { AuthClient, IAuthClientKey } from '../app/api/AuthClient.ts';
import { Context } from '../lib/scope/Context.ts';
import { AuthService } from '../app/domain/auth/AuthService.ts';
import { ApiClient, IApiClientKey } from '../app/api/ApiClient.ts';
import { TodoService } from '../app/widgets/todo/TodoService.ts';
import { UserService } from '../app/widgets/auth/UserService.ts';
import { ErrorService } from '../app/widgets/errors/ErrorService.ts';
import { MessageStore } from '../app/widgets/messages/MessageStore.ts';
import { MessageService } from '../app/widgets/messages/MessageService.ts';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(R.fromValue(new Subject()).to(IErrorBusKey.key))
      .use(R.fromClass(TodoStore))
      .use(R.fromClass(UserStore))
      .use(R.fromClass(ServiceMediator))
      .use(R.fromClass(CheckPermission))
      .use(R.fromClass(ErrorHandler))
      .use(R.fromClass(TodoRepo))
      .use(R.fromClass(UserRepo))
      .use(R.fromClass(AuthService))
      .use(R.fromClass(TodoService))
      .use(R.fromClass(UserService))
      .use(R.fromClass(MessageService))
      .use(R.fromClass(ErrorService))
      .use(R.fromClass(MessageStore))
      .use(R.fromValue(new Context(new ApiClient('someToken'))).to(IApiClientKey.key))
      .use(
        R.fromClass(AuthClient)
          .to(IAuthClientKey.key)
          .pipe(scope(hasTags.every('application')), singleton()),
      );
  }
}
