import { IContainer, IContainerModule, Registration as R, singleton } from 'ts-ioc-container';
import { TodoRepo } from '@services/todo/TodoRepo.ts';
import { ProfileRepo } from '@services/user/ProfileRepo.ts';
import { TodoStore } from '@services/todo/TodoStore.ts';
import { UserService } from '@services/user/UserService.ts';
import { FavoritesService } from '@services/favourites/FavoritesService.ts';
import { NotificationStore } from '@services/notifications/NotificationStore.ts';
import { ErrorService } from '@framework/errors/ErrorService.ts';
import { AuthStore } from '@services/auth/AuthStore.ts';
import { AuthProvider } from '@services/auth/AuthProvider.ts';
import { AuthClient, IAuthClientKey } from '@services/auth/AuthClient.ts';
import { hasTags } from '@framework/scope.ts';
import { TabsChannel } from '@services/tabs/ITabsChannel.ts';
import { DialogManager } from '@services/dialog/IDialogManager.ts';
import { AlertService } from '@services/alert/IAlertService.ts';

export class CommonServices implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      // User
      .addRegistration(R.fromClass(ProfileRepo))
      .addRegistration(R.fromClass(UserService))

      // Todos
      .addRegistration(R.fromClass(TodoRepo))
      .addRegistration(R.fromClass(TodoStore))

      // Favorites
      .addRegistration(R.fromClass(FavoritesService))
      .addRegistration(R.fromClass(NotificationStore))

      // Errors
      .addRegistration(R.fromClass(ErrorService))

      // MultiTabs
      .addRegistration(R.fromClass(TabsChannel))

      // Dialogs
      .addRegistration(R.fromClass(DialogManager))

      // Alerts
      .addRegistration(R.fromClass(AlertService))

      // Auth
      .addRegistration(R.fromClass(AuthStore))
      .addRegistration(R.fromClass(AuthProvider))
      .addRegistration(
        R.fromClass(AuthClient).assignToKey(IAuthClientKey.key).pipe(singleton()).when(hasTags.every('application')),
      );
  }
}
