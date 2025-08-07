import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

// Mutation has params payload, resourceId, so it can be used after a create where the id is not known at hook creation time
// Not certain this is the best patter
const useClaim = ({
  resourceEndpoint, // This should be the base endpoint for resource, eg erm/sas
}) => {
  const ky = useOkapiKy();


  const { mutateAsync: claim } = useMutation(
    ['AccessControl', 'Claim', resourceEndpoint],
    ({ payload, resourceId }) => {
      return ky.post(`${resourceEndpoint}/${resourceId}/claim`, { json: payload }).json();
    },
  );

  return {
    claim
  };
};

export default useClaim;
