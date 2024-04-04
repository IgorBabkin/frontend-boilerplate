import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { IErrorBusKey } from '../app/domain/errors/ErrorBus.ts';
import { LoadConfig } from '../app/widgets/config/LoadConfig.ts';
import { TodoStore } from '../app/domain/todo/TodoStore.ts';
import { ConfigStore } from '../app/domain/config/ConfigStore.ts';
import { Subject } from 'rxjs';
import { CommandMediator } from '../lib/mediator/CommandMediator.ts';
import { IsConfigLoaded } from '../app/widgets/config/IsConfigLoaded.ts';
import { LoadTodoList } from '../app/widgets/todo/operations/LoadTodoList.ts';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(R.fromValue(new Subject()).to(IErrorBusKey))
      .use(R.fromClass(TodoStore))
      .use(R.fromClass(ConfigStore))
      .use(R.fromClass(CommandMediator))
      .use(R.fromClass(LoadTodoList))
      .use(R.fromClass(IsConfigLoaded))
      .use(R.fromClass(LoadConfig));
  }
}
