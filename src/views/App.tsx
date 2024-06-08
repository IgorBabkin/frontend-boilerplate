import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from '@widgets/NotificationsWidget';
import { application } from '@helpers/scope/components';
import { Container, MetadataInjector } from 'ts-ioc-container';
import NavigationWidget from '@widgets/NavigationWidget';
import { ProcessEnv } from '@env/ProcessEnv';
import { useOnPageLeave } from '../lib/react/eventHooks';
import { useContextOrFail } from '../lib/react/context';
import { disposeScope, ScopeContext } from '@helpers/scope/ScopeContext';
import { CommonOperations } from '@operations/CommonOperations.ts';
import { CommonLibs } from '@lib/CommonLibs.ts';
import { CommonFramework } from '@framework/CommonFramework.ts';
import { CommonServices } from '@services/CommonServices.ts';

const env = ProcessEnv.parse(import.meta.env);
const createContainer = (tags: string[]) =>
  new Container(new MetadataInjector(), { tags })
    .use(new CommonLibs(env))
    .use(new CommonOperations())
    .use(new CommonFramework())
    .use(new CommonServices());

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
