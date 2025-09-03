import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { PCIS_ENDPOINT, PCIS_QUERY_KEY_BASE } from '../../../constants';

const usePCIs = ({
  queryParams = [],
  queryNamespaceGenerator = (qp) => [...PCIS_QUERY_KEY_BASE, PCIS_ENDPOINT, qp],
  queryOptions = {}
}) => {
  const ky = useOkapiKy();
  const queryString = useMemo(() => (queryParams.length > 0 ? `?${queryParams.join('&')}` : ''), [queryParams]);

  const pcisQuery = useQuery(
    queryNamespaceGenerator(queryParams),
    () => ky.get(`${PCIS_ENDPOINT}${queryString}`).json(),
    {
      ...queryOptions
    }
  );

  return ({
    pcis: pcisQuery.data, // Shortcuts to important parts of the query
    isLoading: pcisQuery.isLoading,
    isFetching: pcisQuery.isFetching,
    pcisQuery,
  });
};

export default usePCIs;
