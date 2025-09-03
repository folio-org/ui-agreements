import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { PACKAGES_ENDPOINT, PACKAGES_QUERY_KEY_BASE } from '../../../constants';

const usePackages = ({
  queryParams = [],
  queryNamespaceGenerator = (qp) => [...PACKAGES_QUERY_KEY_BASE, PACKAGES_ENDPOINT, qp],
  queryOptions = {}
}) => {
  const ky = useOkapiKy();
  const queryString = useMemo(() => (queryParams.length > 0 ? `?${queryParams.join('&')}` : ''), [queryParams]);

  const packagesQuery = useQuery(
    queryNamespaceGenerator(queryParams),
    () => ky.get(`${PACKAGES_ENDPOINT}${queryString}`).json(),
    {
      ...queryOptions
    }
  );

  return ({
    packages: packagesQuery.data, // Shortcuts to important parts of the query
    isLoading: packagesQuery.isLoading,
    isFetching: packagesQuery.isFetching,
    packagesQuery,
  });
};

export default usePackages;
