import { widget } from '@helpers/scope/components.tsx';

import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { useCallback } from 'react';
import { ModalDialog } from '@ui/dialog/ModalDialog.tsx';
import './modalWidget.scss';
import { useObs$ } from '@helpers/observable.ts';
import { AlertMessage } from '@services/alert/IAlertService.ts';
import { IModalControllerKey } from '@operations/alerts/AlertsController.ts';
import { Entity } from '@lib/types.ts';

const ModalWidget = widget(() => {
  const controller = useDependency(IModalControllerKey.resolve);
  const deleteMessage = useCallback((id: string) => () => controller.closeAlert(id), [controller]);
  const [[m]] = useObs$<Entity<AlertMessage>[]>(controller.alerts$, []);

  if (!m) {
    return null;
  }

  return (
    <ModalDialog title={m.title} onClose={deleteMessage(m.id)}>
      {m.body}
    </ModalDialog>
  );
}, 'NotificationsWidget');

export default ModalWidget;
