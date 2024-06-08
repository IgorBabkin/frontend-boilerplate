import { IContainer, IContainerModule, Registration as R } from 'ts-ioc-container';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { ApiClient } from '@ibabkin/backend-template';
import axios from 'axios';
import { IEnv } from '@env/IEnv.ts';
import { IApiClientKey } from '@lib/api/ApiClient.ts';
import { Scope } from '@framework/scope.ts';

export class CommonLibs implements IContainerModule {
  private apiClient = new ApiClient(
    axios.create({
      baseURL: this.env.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
  constructor(private env: IEnv) {}
  applyTo(container: IContainer): void {
    container
      .add(R.fromClass(ObservableStore))
      .add(R.fromValue(this.apiClient).to(IApiClientKey.key).when(Scope.application));
  }
}
