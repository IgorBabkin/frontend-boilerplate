import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { ControllerMediator } from '@framework/controller/ControllerMediator.ts';
import { MiddlewareMediator } from '@framework/middleware/MiddlewareMediator.ts';

export class CommonFramework implements IContainerModule {
  applyTo(container: IContainer): void {
    container.add(R.fromClass(ControllerMediator));
    container.add(R.fromClass(MiddlewareMediator));
  }
}
