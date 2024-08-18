import { widget } from '@helpers/scope/components.tsx';

import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { useCallback } from 'react';
import { ModalDialog } from '@ui/dialog/ModalDialog.tsx';
import './modalWidget.scss';
import { useArrayState } from '@lib/observable/hooks.ts';
import { IModalControllerKey } from '@operations/modal/IModalDialogController.ts';
import { createEntity, Entity } from '@lib/types.ts';

const appendEntity =
  <T,>(value: T) =>
  (prevState: Entity<T>[]) => [...prevState, createEntity(value)];

const ModalWidget = widget(() => {
  const controller = useDependency(IModalControllerKey.resolve);
  const [notifications, setNotifications] = useArrayState(controller.notifications$, { mapFn: appendEntity });
  const deleteMessage = useCallback(
    (id: string) => () => setNotifications(notifications.filter((v) => v.id !== id)),
    [notifications, setNotifications],
  );

  const [m] = notifications;

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
