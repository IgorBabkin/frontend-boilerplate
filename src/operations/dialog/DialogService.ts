import { action, Unsubscribe } from '@framework/hooks/OnViewInit.ts';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { UserIsNotLoggedInError } from '@framework/errors/UserIsNotLoggedInError.ts';
import { AppDialogKey, IDialogManagerKey } from '@services/dialog/IDialogManager.ts';
import { type IContainer } from 'ts-ioc-container';
import { map } from 'rxjs';
import { unsubscribeAll } from '@lib/observable/utils.ts';
import { IDialogServiceKey } from '@operations/dialog/IDialogService.ts';

export const DialogService = IDialogServiceKey.register((s: IContainer) => {
  const dialogManager = IDialogManagerKey.resolve(s);
  const showDialog = action(
    (key: AppDialogKey) => {
      dialogManager.toggleDialog(key, true);
    },
    {
      subscribeOn: (s) =>
        IErrorServiceKey.resolve(s)
          .filter$(UserIsNotLoggedInError.match)
          .pipe(map(() => AppDialogKey.login)),
    },
  );

  return {
    isDialogVisible$: (login: AppDialogKey) => dialogManager.isDialogVisible$(login),

    showDialog,

    closeDialog: (key: AppDialogKey) => {
      dialogManager.toggleDialog(key, false);
    },

    init(): void | Unsubscribe {
      return unsubscribeAll(
        IErrorServiceKey.resolve(s)
          .filter$(UserIsNotLoggedInError.match)
          .pipe(map(() => AppDialogKey.login))
          .subscribe({ next: showDialog }),
      );
    },
  };
});
