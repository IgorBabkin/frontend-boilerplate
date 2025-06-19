import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { ControllerMediator } from '@framework/controller/ControllerMediator.ts';
import { MiddlewareMediator } from '@framework/middleware/MiddlewareMediator.ts';

export class CommonFramework implements IContainerModule {
  applyTo(container: IContainer): void {
    container.addRegistration(R.fromClass(ControllerMediator));
    container.addRegistration(R.fromClass(MiddlewareMediator));
  }
}
