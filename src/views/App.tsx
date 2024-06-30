import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from '@widgets/NotificationsWidget';
import { application } from '@helpers/scope/components';
import NavigationWidget from '@widgets/NavigationWidget';
import { useOnPageLeave } from '../lib/react/eventHooks';
import { useContextOrFail } from '../lib/react/context';
import { disposeScope, ScopeContext } from '@helpers/scope/ScopeContext';
import { createScope } from '../container.ts';

const App = application(() => {
  const scope = useContextOrFail(ScopeContext);
  useOnPageLeave(() => disposeScope(scope), [scope]);
  return (
    <div>
      <NotificationsWidget />
      <h1>App</h1>
      <NavigationWidget />
      <Outlet />
    </div>
  );
}, createScope);

export default App;
