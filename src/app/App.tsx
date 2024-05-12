import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from './widgets/notifications/NotificationsWidget.tsx';
import { application } from '@lib/scope/components.tsx';
import { Container, MetadataInjector } from 'ts-ioc-container';
import { Common } from '../stages/Common.ts';
import Navigation from '@widgets/navigation/Navigation.tsx';
import { ProcessEnv } from '../env/ProcessEnv.ts';
import { useOnPageLeave } from '@lib/react/hooks.ts';
import { useContextOrFail } from '@lib/react/context.ts';
import { disposeScope, ScopeContext } from '@lib/scope/Scope.tsx';

const env = ProcessEnv.parse(import.meta.env);
const createContainer = (tags: string[]) => new Container(new MetadataInjector(), { tags }).use(new Common(env));

const App = application(() => {
  const scope = useContextOrFail(ScopeContext);
  useOnPageLeave(() => disposeScope(scope));
  return (
    <div>
      <NotificationsWidget />
      <h1>App</h1>
      <Navigation />
      <Outlet />
    </div>
  );
}, createContainer);

export default App;
