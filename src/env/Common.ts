import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { IErrorBusKey } from '../app/domain/errors/ErrorBus.ts';
import { Authenticate } from '../app/widgets/auth/Authenticate.ts';
import { TodoStore } from '../app/domain/todo/TodoStore.ts';
import { AuthStore } from '../app/domain/auth/AuthStore.ts';
import { Subject } from 'rxjs';
import { CommandMediator } from '../lib/mediator/CommandMediator.ts';
import { LoadTodoList } from '../app/widgets/todo/operations/LoadTodoList.ts';
import { CheckPermission } from '../app/widgets/auth/CheckPermission.ts';
import { ErrorHandler } from '../app/domain/errors/IErrorHandler.ts';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container
      .use(R.fromValue(new Subject()).to(IErrorBusKey))
      .use(R.fromClass(TodoStore))
      .use(R.fromClass(AuthStore))
      .use(R.fromClass(CommandMediator))
      .use(R.fromClass(LoadTodoList))
      .use(R.fromClass(CheckPermission))
      .use(R.fromClass(ErrorHandler))
      .use(R.fromClass(Authenticate));
  }
}
