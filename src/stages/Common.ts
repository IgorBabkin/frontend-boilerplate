import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { CheckPermission } from '@operations/cross/CheckPermission.ts';
import { TodoRepo } from '../services/todo/TodoRepo';
import { hasTags, Scope } from '@framework/scope.ts';
import { UserRepo } from '../services/user/UserRepo';
import { AuthClient, IAuthClientKey } from '../lib/api/AuthClient';
import { AuthProvider } from '../services/auth/AuthProvider';
import { IApiClientKey } from '../lib/api/ApiClient';
import { TodoService } from '../services/todo/TodoService';
import { UserService } from '../services/user/UserService';
import { ErrorService } from '@framework/errors/ErrorService';
import { NotificationService } from '../services/notifications/NotificationService';
import { AuthService } from '../services/auth/AuthService';
import { ApiClient } from '@ibabkin/backend-template';
import axios from 'axios';
import { IEnv } from '@env/IEnv';
import { ObservableStore } from '../lib/observable/ObservableStore';
import { FavoritesService } from '../services/todo/FavoritesService';
import { ControllerMediator } from '@framework/controller/ControllerMediator.ts';

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
      .add(R.fromClass(ControllerMediator))
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
      .add(R.fromClass(AuthService))
      .add(R.fromValue(this.apiClient).to(IApiClientKey.key).when(Scope.application))
      .add(R.fromClass(AuthClient).to(IAuthClientKey.key).pipe(singleton()).when(hasTags.every('application')));
  }
}
