import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from './widgets/notifications/NotificationsWidget.tsx';
import { ScopeProps, withScope } from '@lib/scope/ScopeHOCs.tsx';
import { Container, MetadataInjector } from 'ts-ioc-container';
import { Common } from '../env/Common.ts';
import NavigationWidget from '@widgets/navigation/NavigationWidget.tsx';

const createContainer = (tags: string[]) => new Container(new MetadataInjector(), { tags }).use(new Common());

const App = withScope(() => {
  return (
    <div>
      <NotificationsWidget />
      <h1>App</h1>
      <NavigationWidget />
      <Outlet />
    </div>
  );
}, ScopeProps.application(createContainer));

export default App;
