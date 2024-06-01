import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { IErrorBusKey } from '@modules/errors/ErrorBus.ts';
import { TodoStore } from '@modules/todo/TodoStore.ts';
import { UserStore } from '@modules/user/UserStore.ts';
import { Subject } from 'rxjs';
import { ServiceMediator } from '@framework/components/ServiceMediator.ts';
import { CheckPermission } from '@widgets/CheckPermission.ts';
import { ErrorHandler } from '@modules/errors/IErrorHandler.ts';
import { TodoRepo } from '@modules/todo/TodoRepo.ts';
import { hasTags, Scope } from '@framework/scope/container.ts';
import { UserRepo } from '@modules/user/UserRepo.ts';
import { AuthClient, IAuthClientKey } from '@core/api/AuthClient.ts';
import { AuthProvider } from '@modules/auth/AuthProvider.ts';
import { IApiClientKey } from '@core/api/ApiClient.ts';
import { TodoService } from '@modules/todo/TodoService.ts';
import { UserService } from '@modules/user/UserService.ts';
import { ErrorService } from '@modules/errors/ErrorService.ts';
import { NotificationStore } from '@modules/notifications/NotificationStore.ts';
import { NotificationService } from '@modules/notifications/NotificationService.ts';
import { AuthService } from '@modules/auth/AuthService.ts';
import { ApiClient } from '@ibabkin/backend-template';
import axios from 'axios';
import { IEnv } from '@env/IEnv.ts';
import { ObservableStore } from '@core/observable/ObservableStore.ts';
import { FavoritesService } from '@modules/todo/FavoritesService.ts';

export class Common implements IContainerModule {
  private apiClient = new ApiClient(
    axios.create({
      baseURL: this.env.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );

  constructor(private env: IEnv) {}

  applyTo(container: IContainer): void {
    container
      .add(R.fromValue(new Subject()).to(IErrorBusKey.key))
      .add(R.fromClass(TodoStore))
      .add(R.fromClass(UserStore))
      .add(R.fromClass(ServiceMediator))
      .add(R.fromClass(CheckPermission))
      .add(R.fromClass(ErrorHandler))
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(UserRepo))
      .add(R.fromClass(AuthProvider))
      .add(R.fromClass(TodoService))
      .add(R.fromClass(UserService))
      .add(R.fromClass(FavoritesService))
      .add(R.fromClass(ObservableStore))
      .add(R.fromClass(NotificationService))
      .add(R.fromClass(ErrorService))
      .add(R.fromClass(NotificationStore))
      .add(R.fromClass(AuthService))
      .add(R.fromValue(this.apiClient).to(IApiClientKey.key).when(Scope.application))
      .add(R.fromClass(AuthClient).to(IAuthClientKey.key).pipe(singleton()).when(hasTags.every('application')));
  }
}
