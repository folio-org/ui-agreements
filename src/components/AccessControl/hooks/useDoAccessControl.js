import { useMemo } from 'react';

import useEnabledEngines from './useEnabledEngines';
import { ACQUISITION_UNIT_POLICY_TYPE } from '../constants';

const useDoAccessControl = ({
  endpoint // The BASE endpoint for accessControl, such as erm/accessControl for mod-agreements :)
} = {}) => {
  // It is up to the BACKEND to check whether the various interfaces etc are present,
  // and to enrich with their information
  const enabledEnginesQuery = useEnabledEngines({ endpoint });
  const doAccessControl = useMemo(() => enabledEnginesQuery.enabledEngines?.[ACQUISITION_UNIT_POLICY_TYPE] ?? false, [enabledEnginesQuery]); // For now, we only need to check acquisition units

  return { doAccessControl, enabledEnginesQuery };
};

export default useDoAccessControl;
