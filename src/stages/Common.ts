import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { CheckPermission } from '@operations/cross/CheckPermission.ts';
import { TodoRepo } from '../services/todo/TodoRepo';
import { hasTags, Scope } from '@framework/scope.ts';
import { UserRepo } from '../services/user/UserRepo';
import { AuthClient, IAuthClientKey } from '@services/auth/AuthClient.ts';
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
import { FavoritesService } from '@services/favourites/FavoritesService.ts';
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
      .add(R.fromClass(ObservableStore))
      .add(R.fromValue(this.apiClient).to(IApiClientKey.key).when(Scope.application));

    this.addServices(container);
    this.addOperations(container);
  }

  private addServices(container: IContainer): void {
    container
      .add(R.fromClass(TodoRepo))
      .add(R.fromClass(UserRepo))
      .add(R.fromClass(TodoService))
      .add(R.fromClass(UserService))
      .add(R.fromClass(FavoritesService))
      .add(R.fromClass(NotificationService))
      .add(R.fromClass(ErrorService))

      // Auth
      .add(R.fromClass(AuthService))
      .add(R.fromClass(AuthProvider))
      .add(R.fromClass(AuthClient).to(IAuthClientKey.key).pipe(singleton()).when(hasTags.every('application')));
  }

  private addOperations(container: IContainer): void {
    container.add(R.fromClass(CheckPermission));
  }
}
