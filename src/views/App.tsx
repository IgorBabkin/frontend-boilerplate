import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from '@widgets/notification/NotificationsWidget.tsx';
import { application } from '@helpers/scope/components';
import NavigationWidget from '@widgets/NavigationWidget';
import { useOnPageLeave } from '../lib/react/eventHooks';
import { useContextOrFail } from '../lib/react/context';
import { disposeScope, ScopeContext } from '@helpers/scope/ScopeContext';
import { createScope } from '../container.ts';
import { useEffect } from 'react';
import { env } from '@env/IEnv.ts';
import { LogPlayer } from '@lib/timeTravel/LogPlayer.ts';
import { CommandExecuter } from '@lib/timeTravel/CommandLog.ts';
import ModalWidget from '@widgets/modal/ModalWidget.tsx';

const App = application(() => {
  const scope = useContextOrFail(ScopeContext);
  useOnPageLeave(() => disposeScope(scope), [scope]);

  useEffect(() => {
    const player = new LogPlayer(new CommandExecuter(scope));
    player.setLogs(JSON.parse(env('operationLogs')(scope)));
    void player.replay(0);
  }, [scope]);

  return (
    <div>
      <NotificationsWidget />
      <ModalWidget />
      <h1>App</h1>
      <NavigationWidget />
      <Outlet />
    </div>
  );
}, createScope);

export default App;
