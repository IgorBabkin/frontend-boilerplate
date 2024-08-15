import { widget } from '@helpers/scope/components.tsx';

import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { INotificationControllerKey } from '@operations/notifications/INotificationController.ts';
import { useCallback } from 'react';
import { useArrayState } from '@lib/observable/hooks.ts';
import { createEntity, Entity } from '@lib/types.ts';
import { ModalDialog } from '@ui/dialog/ModalDialog.tsx';
import './modalWidget.scss';

const mapToArray =
  <T,>(value: T) =>
  (prev: Entity<T>[]) => [...prev, createEntity(value)];

const ModalWidget = widget(() => {
  const notificationController = useDependency(INotificationControllerKey.resolve);
  const [notifications, setNotifications] = useArrayState(notificationController.message$, { mapFn: mapToArray });
  const removeMessage = useCallback(
    (id: string) => () => setNotifications((prevState) => prevState.filter((v) => v.id !== id)),
    [setNotifications],
  );
  const [m] = notifications;

  if (!m) {
    return null;
  }

  return (
    <ModalDialog title={m.title} onClose={removeMessage(m.id)}>
      {m.body}
    </ModalDialog>
  );
}, 'NotificationsWidget');

export default ModalWidget;
