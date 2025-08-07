import { useMemo } from 'react';

import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useClaimPolicies = ({
  endpoint, // This should be the base accessControl endpoint, such as erm/accessControl
  queryOptions
}) => {
  const ky = useOkapiKy();

  const { data: { claimPolicies = [] } = {} } = useQuery(
    ['AccessControl', 'claimPolicies', endpoint],
    () => ky.get(`${endpoint}/claimPolicies`).json(),
    queryOptions
  );

  // Also give an option flattening to list of policies with type injected... in the same shape as the policy claim list
  const flattenedClaimPolicies = useMemo(() => {
    const policies = claimPolicies.flatMap(claim => claim.policies.map(policy => ({ policy, type: claim.type })));

    return policies.filter((policy, index, self) => index === self.findIndex(p => p.policy.id === policy.policy.id && p.type === policy.type));
  }, [claimPolicies]);

  return {
    claimPolicies,
    flattenedClaimPolicies
  };
};

export default useClaimPolicies;
