import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { IErrorBusKey } from '../domain/ErrorBus.ts';
import { LoadConfig } from '../widgets/config/LoadConfig.ts';
import { TodoStore } from '../domain/TodoStore.ts';
import { LoadTodoList } from '../widgets/todoList/LoadTodoList.ts';
import { ConfigStore } from '../domain/ConfigStore.ts';
import { Subject } from 'rxjs';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(R.fromValue(new Subject()).to(IErrorBusKey))
      .use(R.fromClass(TodoStore))
      .use(R.fromClass(ConfigStore))
      .use(R.fromClass(LoadTodoList))
      .use(R.fromClass(LoadConfig));
  }
}
