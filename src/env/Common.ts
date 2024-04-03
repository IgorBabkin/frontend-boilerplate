import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { IErrorBusKey } from '../app/domain/ErrorBus.ts';
import { LoadConfig } from '../app/widgets/config/LoadConfig.ts';
import { TodoStore } from '../app/domain/TodoStore.ts';
import { LoadTodoList } from '../app/widgets/todoList/operations/LoadTodoList.ts';
import { ConfigStore } from '../app/domain/ConfigStore.ts';
import { Subject } from 'rxjs';
import { CommandMediator } from '../lib/mediator/CommandMediator.ts';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(R.fromValue(new Subject()).to(IErrorBusKey))
      .use(R.fromClass(TodoStore))
      .use(R.fromClass(ConfigStore))
      .use(R.fromClass(CommandMediator))
      .use(R.fromClass(LoadTodoList))
      .use(R.fromClass(LoadConfig));
  }
}
