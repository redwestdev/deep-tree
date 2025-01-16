import {
  useMutation,
  MutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { api } from '../../_api';
import {
  TSuccess,
  TPayload,
  TError,
} from '../../_api/AltrisRESTClient/routes/${Namespace}/${Routname}';

type TParams = {
  examId: string;
};

export type T${Basename}Mut = UseMutationResult<
  TSuccess,
  TError,
  TPayload,
  unknown
>;

export type T${Basename}MutOpt = Omit<
  MutationOptions<TSuccess, TError, TPayload>,
  'mutationKey'
>;

export const get${Basename}MutKey = (params: TParams) => [
  '${Namespace}',
  '${Routname}',
  params,
];

export function get${Basename}MutOpts(
  params: TParams,
  options?: T${Basename}MutOpt
) {
  return {
    ...options,
    mutationKey: get${Basename}MutKey(params),
    mutationFn: (variables: TPayload) =>
      api.${Namespace}.${Routname}(variables),
  };
}

export default function use${Basename}Mut(
  params: TParams,
  options?: T${Basename}MutOpt
) {
  const opts = get${Basename}MutOpts(params, options);
  return useMutation<TSuccess, TError, TPayload>(opts);
}
