import { widget } from '@helpers/scope/components.tsx';

import { useDep } from '@helpers/scope/ScopeContext.ts';
import { useCallback } from 'react';
import { ModalDialog } from '@ui/dialog/ModalDialog.tsx';
import './modalWidget.scss';
import { useObs$ } from '@helpers/observable.ts';
import { AlertMessage, IAlertServiceKey } from '@services/alert/IAlertService.ts';
import { Entity } from '@lib/types.ts';

const ModalWidget = widget(() => {
  const service = useDep(IAlertServiceKey.resolve);
  const deleteMessage = useCallback((id: string) => () => service.deleteAlert(id), [controller]);
  const [[m]] = useObs$<Entity<AlertMessage>[]>(service.messages$, []);

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
