import { IContainer, IContainerModule, Registration as R, scope, singleton } from 'ts-ioc-container';
import { createErrorBus, IErrorBusKey } from '../ErrorBus.ts';
import { LoadConfigCommand } from '../pages/LoadConfigCommand.ts';

export class Common implements IContainerModule {
  applyTo(container: IContainer): void {
    container.use(
      R.fromFn(createErrorBus)
        .pipe(
          singleton(),
          scope((c) => c.hasTag('application')),
        )
        .to(IErrorBusKey),
      R.fromClass(LoadConfigCommand),
    );
  }
}
