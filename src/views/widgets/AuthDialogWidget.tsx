import { widget } from '@helpers/scope/components.tsx';
import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { ModalDialog } from '@ui/dialog/ModalDialog.tsx';
import { useObs$ } from '@helpers/observable.ts';
import { IDialogControllerKey } from '@operations/dialog/DialogController.ts';

export const AuthDialogWidget = widget(() => {
  const controller = useDependency(IDialogControllerKey.resolve);
  const [isModalOpen] = useObs$(controller.isAuthDialogVisible$, false);
  if (!isModalOpen) return null;

  return (
    <ModalDialog title="Login" onClose={() => controller.closeAuthDialog()}>
      AuthWidget
    </ModalDialog>
  );
}, 'AuthDialogWidget');
