import './App.scss';
import { Outlet } from 'react-router-dom';
import NotificationsWidget from './widgets/notifications/NotificationsWidget.tsx';
import { application } from '@lib/scope/ScopeHOCs.tsx';
import { Container, MetadataInjector } from 'ts-ioc-container';
import { Common } from '../env/Common.ts';
import Navigation from '@widgets/navigation/Navigation.tsx';

const createContainer = (tags: string[]) => new Container(new MetadataInjector(), { tags }).use(new Common());

const App = application(() => {
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
