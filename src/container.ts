import { ProcessEnv } from '@env/ProcessEnv.ts';
import { Container, MetadataInjector } from 'ts-ioc-container';
import { CommonLibs } from '@lib/CommonLibs.ts';
import { CommonOperations } from '@operations/CommonOperations.ts';
import { CommonFramework } from '@framework/CommonFramework.ts';
import { CommonServices } from '@services/CommonServices.ts';
import { CommonContext } from '@context/CommonContext.ts';

const env = ProcessEnv.parse(import.meta.env);
export const createScope = (tags: string[]) =>
  new Container(new MetadataInjector(), { tags })
    .use(new CommonLibs(env))
    .use(new CommonOperations())
    .use(new CommonFramework())
    .use(new CommonContext())
    .use(new CommonServices());
