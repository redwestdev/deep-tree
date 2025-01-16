import {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { api } from '_api';

import { TSuccess, TParams } from '_api/AltrisRESTClient/routes/${Namespace}/${Routname}';

export type T${Basename}Query = UseQueryResult<TSuccess>;

export type T${Basename}Opts = Omit<
  DefinedInitialDataOptions<TSuccess>,
  'queryKey' | 'initialData'
>;

export const get${Basename}Key = (params: TParams) => [
  '${Namespace}',
  '${Routname}',
  params,
];

export default function use${Basename}Qry(
  params: TParams,
  options?: T${Basename}Opts
) {
  const opts = get${Basename}Opts(params, options);
  return useQuery<TSuccess>(opts);
}

export function get${Basename}Opts(
  params: TParams,
  options?: T${Basename}Opts
): UndefinedInitialDataOptions<TSuccess> {
  return {
    ...options,
    queryKey: get${Basename}Key(params),
    queryFn: ({ signal }) => api.${Namespace}.${Routname}(params, { signal }),
    enabled: Boolean(options?.enabled ?? params.examId),
  };
}