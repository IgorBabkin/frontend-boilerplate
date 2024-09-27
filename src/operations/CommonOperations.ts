import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { CheckPermissionGuard } from '@operations/permissions/CheckPermissionGuard.ts';
import { FavoriteService } from '@operations/favourites/FavoriteService.ts';
import { UserInfoController } from '@operations/user/UserInfoController.ts';
import { TodoService } from '@operations/todo/TodoService.ts';
import { useNotificationService } from '@operations/notifications/NotificationService.ts';
import { WindowSyncController } from '@operations/window/WindowSyncController.ts';
import { DialogService } from '@operations/dialog/DialogService.ts';

export class CommonOperations implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .add(R.fromClass(CheckPermissionGuard))
      .add(FavoriteService)
      .add(R.fromClass(UserInfoController))
      .add(useNotificationService)
      .add(R.fromClass(WindowSyncController))
      .add(DialogService)
      .add(R.fromClass(TodoService));
  }
}
