import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { TodoStore } from '@modules/todo/TodoStore';
import { UserStore } from '@modules/user/UserStore';
import { ServiceMediator } from '@framework/service/ServiceMediator.ts';
import { CheckPermission } from '@modules/user/CheckPermission';
import { TodoRepo } from '@modules/todo/TodoRepo';
import { hasTags, Scope } from '@framework/scope.ts';
import { UserRepo } from '@modules/user/UserRepo';
import { AuthClient, IAuthClientKey } from '../lib/api/AuthClient';
import { AuthProvider } from '@modules/auth/AuthProvider';
import { IApiClientKey } from '../lib/api/ApiClient';
import { TodoService } from '@modules/todo/TodoService';
import { UserService } from '@modules/user/UserService';
import { ErrorService } from '@framework/errors/ErrorService';
import { NotificationStore } from '@modules/notifications/NotificationStore';
import { NotificationService } from '@modules/notifications/NotificationService';
import { AuthService } from '@modules/auth/AuthService';
import { ApiClient } from '@ibabkin/backend-template';
import axios from 'axios';
import { IEnv } from '@env/IEnv';
import { ObservableStore } from '../lib/observable/ObservableStore';
import { FavoritesService } from '@modules/todo/FavoritesService';

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
      .add(R.fromClass(TodoStore))
      .add(R.fromClass(UserStore))
      .add(R.fromClass(ServiceMediator))
      .add(R.fromClass(CheckPermission))
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
