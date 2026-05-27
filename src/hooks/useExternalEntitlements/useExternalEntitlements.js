import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { AGREEMENT_LINES_EXTERNAL_ENDPOINT } from '../../constants';

export const useExternalEntitlements = (options = {}) => {
  const {
    enabled = true,
    searchParams,
    tenantId,
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const result = useQuery({
    queryKey: [AGREEMENT_LINES_EXTERNAL_ENDPOINT, searchParams, tenantId],
    queryFn: () => ky.get(AGREEMENT_LINES_EXTERNAL_ENDPOINT, { searchParams }).json(),
    enabled,
  });

  return result;
};
