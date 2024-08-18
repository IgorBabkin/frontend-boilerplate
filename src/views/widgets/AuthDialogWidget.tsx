import { widget } from '@helpers/scope/components.tsx';
import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { ModalDialog } from '@ui/dialog/ModalDialog.tsx';
import { useObs$ } from '@helpers/observable.ts';
import { IAuthControllerKey } from '@operations/auth/AuthController.ts';

export const AuthDialogWidget = widget(() => {
  const controller = useDependency(IAuthControllerKey.resolve);
  const [isModalOpen] = useObs$(controller.isLoginDialogVisible$, false);
  if (!isModalOpen) return null;

  return (
    <ModalDialog title="Login" onClose={() => controller.closeAuthDialog()}>
      AuthWidget
    </ModalDialog>
  );
}, 'AuthDialogWidget');
