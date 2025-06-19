import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { CheckPermissionGuard } from '@operations/permissions/CheckPermissionGuard.ts';
import { useFavoriteService } from '@operations/favourites/UseFavoriteService.ts';
import { UserInfoController } from '@operations/user/UserInfoController.ts';
import { TodoService } from '@operations/todo/TodoService.ts';
import { useNotificationService } from '@operations/notifications/NotificationService.ts';
import { WindowSyncController } from '@operations/window/WindowSyncController.ts';
import { DialogService } from '@operations/dialog/DialogService.ts';

export class CommonOperations implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .addRegistration(R.fromClass(CheckPermissionGuard))
      .addRegistration(useFavoriteService)
      .addRegistration(R.fromClass(UserInfoController))
      .addRegistration(useNotificationService)
      .addRegistration(R.fromClass(WindowSyncController))
      .addRegistration(DialogService)
      .addRegistration(TodoService);
  }
}
