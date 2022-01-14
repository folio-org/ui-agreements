import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import {
  ACQUISITION_METHODS_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

export const useAcqMethods = (methodId) => {
  const ky = useOkapiKy();
  const searchParams = {
    type: 'okapi',
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby value',
  };

  const { isLoading, data } = useQuery(
    ['ui-agreements', 'acq-methods', methodId],
    () => ky.get(
      methodId ? `${ACQUISITION_METHODS_API}/${methodId}` : ACQUISITION_METHODS_API,
      { searchParams },
    ).json().catch(() => null),
  );

  return ({
    acqMethods: (methodId ? [data] : data?.acqMethod) ?? [],
    isLoading,
  });
};

export default useAcqMethods;
