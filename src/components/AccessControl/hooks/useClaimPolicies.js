import { useQuery } from 'react-query';
import omit from 'lodash/omit';
import { useOkapiKy } from '@folio/stripes/core';
import { useMemo } from 'react';

const useClaimPolicies = ({
  endpoint, // This should be the base accessControl endpoint, such as erm/accessControl
  queryOptions
}) => {
  const ky = useOkapiKy();

  const { data: { claimPolicies = [] } = {} } = useQuery(
    ['AccessControl', 'claimPolicies', endpoint],
    () => ky.get(`${endpoint}/claimPolicies`).json(),
    {
      select: (policyData) => { // This will be UNNECESSARY after snapshot rebuilds
        if (policyData.claimPolicyIds) {
          return {
            ...omit(
              policyData,
              'claimPolicyIds'
            ),
            claimPolicies: policyData.claimPolicyIds
          };
        }

        return policyData;
      },
      ...queryOptions,
    }
  );

  // Also give an option flattening to list of policies with type injected
  const flattenedClaimPolicies = useMemo(() => {
    const policies = claimPolicies.flatMap(claim => claim.policies.map(policy => ({ ...policy, type: claim.type })));
    return policies.filter((policy, index, self) => index === self.findIndex(p => p.id === policy.id && p.type === policy.type));
  }, [claimPolicies]);

  return {
    claimPolicies,
    flattenedClaimPolicies
  };
};

export default useClaimPolicies;
