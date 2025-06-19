import { ProcessEnv } from '@env/ProcessEnv.ts';
import { Container } from 'ts-ioc-container';
import { CommonLibs } from '@lib/CommonLibs.ts';
import { CommonOperations } from '@operations/CommonOperations.ts';
import { CommonFramework } from '@framework/CommonFramework.ts';
import { CommonServices } from '@services/CommonServices.ts';
import { CommonContext } from '@context/CommonContext.ts';

const env = ProcessEnv.parse(import.meta.env);
export const createScope = (tags: string[]) =>
  new Container({ tags })
    .useModule(new CommonLibs(env))
    .useModule(new CommonOperations())
    .useModule(new CommonFramework())
    .useModule(new CommonContext())
    .useModule(new CommonServices());
