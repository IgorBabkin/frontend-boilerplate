import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { CheckPermissionGuard } from '@operations/permissions/CheckPermissionGuard.ts';
import { FavoriteController } from '@operations/favourites/FavoriteController.ts';
import { UserInfoController } from '@operations/user/UserInfoController.ts';
import { TodoController } from '@operations/todo/TodoController.ts';
import { NotificationController } from '@operations/notifications/NotificationController.ts';
import { AlertsController } from '@operations/alerts/AlertsController.ts';
import { WindowSyncController } from '@operations/window/WindowSyncController.ts';
import { DialogController } from '@operations/dialog/DialogController.ts';

export class CommonOperations implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .add(R.fromClass(CheckPermissionGuard))
      .add(R.fromClass(FavoriteController))
      .add(R.fromClass(UserInfoController))
      .add(R.fromClass(AlertsController))
      .add(R.fromClass(NotificationController))
      .add(R.fromClass(WindowSyncController))
      .add(R.fromClass(DialogController))
      .add(R.fromClass(TodoController));
  }
}
