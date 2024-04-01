import { IContainer, IContainerModule, Registration as R, scope, singleton } from 'ts-ioc-container';
import { createErrorBus, IErrorBusKey } from '../domain/ErrorBus.ts';
import { LoadConfig } from '../widgets/config/LoadConfig.ts';
import { TodoStore } from '../domain/TodoStore.ts';
import { LoadTodoList } from '../widgets/todoList/LoadTodoList.ts';
import { ConfigStore } from '../domain/ConfigStore.ts';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(
        R.fromFn(createErrorBus)
          .pipe(
            singleton(),
            scope((c) => c.hasTag('application')),
          )
          .to(IErrorBusKey),
      )
      .use(R.fromClass(TodoStore))
      .use(R.fromClass(ConfigStore))
      .use(R.fromClass(LoadTodoList))
      .use(R.fromClass(LoadConfig));
  }
}
