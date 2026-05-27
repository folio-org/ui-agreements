import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { AGREEMENT_LINES_EXTERNAL_ENDPOINT } from '../../constants';

const defaultQueryNamespaceGenerator = (searchParams, tenantId) => [
  'ERM',
  'AgreementLine',
  'external',
  AGREEMENT_LINES_EXTERNAL_ENDPOINT,
  searchParams,
  tenantId,
];

export const useExternalEntitlements = ({
  queryNamespaceGenerator = defaultQueryNamespaceGenerator,
  queryOptions = {},
  searchParams,
  tenantId,
} = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const { data, isLoading } = useQuery({
    queryKey: queryNamespaceGenerator(searchParams, tenantId),
    queryFn: ({ signal }) => ky.get(AGREEMENT_LINES_EXTERNAL_ENDPOINT, { searchParams, signal }).json(),
    ...queryOptions,
  });

  return {
    data,
    isLoading,
  };
};
