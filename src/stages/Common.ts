import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { TodoStore } from '@domain/todo/TodoStore.ts';
import { UserStore } from '@domain/user/UserStore.ts';
import { Subject } from 'rxjs';
import { ServiceMediator } from '@lib/components/ServiceMediator.ts';
import { CheckPermission } from '@widgets/auth/CheckPermission.ts';
import { ErrorHandler } from '@domain/errors/IErrorHandler.ts';
import { TodoRepo } from '@domain/todo/TodoRepo.ts';
import { hasTags, Scope } from '@lib/scope/container.ts';
import { UserRepo } from '@domain/user/UserRepo.ts';
import { AuthClient, IAuthClientKey } from '../app/api/AuthClient.ts';
import { AuthProvider } from '@domain/auth/AuthProvider.ts';
import { IApiClientKey } from '../app/api/ApiClient.ts';
import { TodoService } from '@widgets/todo/TodoService.ts';
import { UserService } from '@widgets/auth/UserService.ts';
import { ErrorService } from '@widgets/errors/ErrorService.ts';
import { NotificationStore } from '@widgets/notifications/NotificationStore.ts';
import { NotificationService } from '@widgets/notifications/NotificationService.ts';
import { AuthService } from '@widgets/auth/AuthService.ts';
import { ApiClient } from '@ibabkin/backend-template';
import axios from 'axios';
import { IEnv } from '../env/IEnv.ts';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { FavoritesService } from '@widgets/todo/FavoritesService.ts';

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
