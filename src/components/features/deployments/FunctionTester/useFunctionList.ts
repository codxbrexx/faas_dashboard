import type { Deployment } from '@/types';
import type { FuncEntry } from './types';

export function useFunctionList(deployment: Deployment): FuncEntry[] {
  return Object.entries(deployment.packages ?? {}).flatMap(([lang, handles]) =>
    handles.flatMap(handle =>
      handle.scope.funcs.map(f => {
        const func = f as {
          name: string;
          async: boolean;
          signature: {
            ret: { type: { name: string } };
            args: { name: string; type: { name: string } }[];
          };
        };
        return {
          name: func.name,
          args: (func.signature?.args ?? []).map(a => ({
            name: a.name,
            type: a.type?.name ?? 'any',
          })),
          returnType: func.signature?.ret?.type?.name ?? 'any',
          lang,
          handleName: handle.name,
          isAsync: func.async ?? false,
        };
      }),
    ),
  );
}
