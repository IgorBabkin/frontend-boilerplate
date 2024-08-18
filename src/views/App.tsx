import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from '@widgets/notification/NotificationsWidget.tsx';
import { application } from '@helpers/scope/components';
import NavigationWidget from '@widgets/NavigationWidget';
import { useIdleTimer, useOnPageLeave } from '../lib/react/eventHooks';
import { disposeScope, useScope } from '@helpers/scope/ScopeContext';
import { createScope } from '../container.ts';
import { useEffect } from 'react';
import { LogPlayer } from '@lib/timeTravel/LogPlayer.ts';
import { CommandExecuter } from '@lib/timeTravel/CommandLog.ts';
import ModalWidget from '@widgets/modal/ModalWidget.tsx';
import { UserInActivityError } from '@framework/errors/UserInActivityError.ts';
import { AuthDialogWidget } from '@widgets/AuthDialogWidget.tsx';

const App = application(() => {
  const scope = useScope();
  useOnPageLeave(() => disposeScope(scope), [scope]);
  useIdleTimer(() => {
    throw new UserInActivityError();
  }, 5000);

  useEffect(() => {
    const player = new LogPlayer(new CommandExecuter(scope));
    void player.replay(0);
  }, [scope]);

  return (
    <div>
      <NotificationsWidget />
      <ModalWidget />
      <AuthDialogWidget />
      <h1>App</h1>
      <NavigationWidget />
      <Outlet />
    </div>
  );
}, createScope);

export default App;
