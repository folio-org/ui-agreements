import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { PACKAGE_ENDPOINT, PACKAGES_QUERY_KEY_BASE } from '../../../constants';

const usePackage = ({
  pkgId,
  queryNamespaceGenerator = () => [...PACKAGES_QUERY_KEY_BASE, pkgId],
  queryOptions = {}
}) => {
  const ky = useOkapiKy();

  const packageQuery = useQuery(
    queryNamespaceGenerator(),
    () => ky.get(`${PACKAGE_ENDPOINT(pkgId)}`).json(),
    {
      enabled: !!pkgId,
      ...queryOptions
    }
  );

  const { data } = packageQuery;

  return ({
    package: data,
    packageQuery
  });
};

export default usePackage;
