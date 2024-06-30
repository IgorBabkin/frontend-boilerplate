import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { PageService } from '@context/PageService.ts';

export class CommonContext implements IContainerModule {
  applyTo(container: IContainer): void {
    container.add(R.fromClass(PageService));
  }
}
