import { widget } from '@helpers/scope/components.tsx';
import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { ModalDialog } from '@ui/dialog/ModalDialog.tsx';
import { useObs$ } from '@helpers/observable.ts';
import { AppDialogKey } from '@services/dialog/IDialogManager.ts';
import { IDialogServiceKey } from '@operations/dialog/IDialogService.ts';

export const AuthDialogWidget = widget(() => {
  const controller = useDependency(IDialogServiceKey.resolve);
  const [isModalOpen] = useObs$(controller.isDialogVisible$(AppDialogKey.login), false);
  if (!isModalOpen) return null;

  return (
    <ModalDialog title="Login" onClose={() => controller.closeDialog(AppDialogKey.login)}>
      AuthWidget
    </ModalDialog>
  );
}, 'AuthDialogWidget');
