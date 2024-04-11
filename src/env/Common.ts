import { IContainer, IContainerModule, Registration as R, scope, singleton } from 'ts-ioc-container';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { TodoStore } from '@domain/todo/TodoStore.ts';
import { UserStore } from '@domain/user/UserStore.ts';
import { Subject } from 'rxjs';
import { ServiceMediator } from '@lib/mediator/ServiceMediator.ts';
import { CheckPermission } from '@widgets/auth/CheckPermission.ts';
import { ErrorHandler } from '@domain/errors/IErrorHandler.ts';
import { TodoRepo } from '@domain/todo/TodoRepo.ts';
import { hasTags } from '@lib/scope/container.ts';
import { UserRepo } from '@domain/user/UserRepo.ts';
import { AuthClient, IAuthClientKey } from '../app/api/AuthClient.ts';
import { Context } from '@lib/scope/Context.ts';
import { AuthProvider } from '@domain/auth/AuthProvider.ts';
import { ApiClient, IApiClientKey } from '../app/api/ApiClient.ts';
import { TodoService } from '@widgets/todo/TodoService.ts';
import { UserService } from '@widgets/auth/UserService.ts';
import { ErrorService } from '@widgets/errors/ErrorService.ts';
import { NotificationStore } from '@widgets/notifications/NotificationStore.ts';
import { NotificationService } from '@widgets/notifications/NotificationService.ts';
import { AuthService } from '@widgets/auth/AuthService.ts';

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
      .use(R.fromClass(AuthProvider))
      .use(R.fromClass(TodoService))
      .use(R.fromClass(UserService))
      .use(R.fromClass(NotificationService))
      .use(R.fromClass(ErrorService))
      .use(R.fromClass(NotificationStore))
      .use(R.fromClass(AuthService))
      .use(R.fromValue(new Context(new ApiClient('someToken'))).to(IApiClientKey.key))
      .use(
        R.fromClass(AuthClient)
          .to(IAuthClientKey.key)
          .pipe(scope(hasTags.every('application')), singleton()),
      );
  }
}
