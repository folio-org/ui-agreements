import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

const usePolicies = ({
  resourceEndpoint, // This is the BASE endpoint for the resource, eg erm/sas
  resourceId,
  queryNamespaceGenerator = () => ['AccessControl', resourceId, 'policies', resourceEndpoint],
  queryOptions = {}
}) => {
  const ky = useOkapiKy();

  // We need to fetch the policies for the resource at hand
  const policiesQuery = useQuery(
    queryNamespaceGenerator(),
    () => ky.get(`${resourceEndpoint}/${resourceId}/policies`).json(),
    {
      enabled: !!resourceId,
      ...queryOptions,
    }
  );

  return {
    policies: policiesQuery.data || [],
    policiesQuery,
  };
};

export default usePolicies;
