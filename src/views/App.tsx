import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from '@widgets/NotificationsWidget';
import { application } from '@helpers/scope/components';
import { Container, MetadataInjector } from 'ts-ioc-container';
import { Common } from '@stages/Common';
import NavigationWidget from '@widgets/NavigationWidget';
import { ProcessEnv } from '@env/ProcessEnv';
import { useOnPageLeave } from '../lib/react/eventHooks';
import { useContextOrFail } from '../lib/react/context';
import { disposeScope, ScopeContext } from '@helpers/scope/ScopeContext';

const env = ProcessEnv.parse(import.meta.env);
const createContainer = (tags: string[]) => new Container(new MetadataInjector(), { tags }).use(new Common(env));

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
}, createContainer);

export default App;
