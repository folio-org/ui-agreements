import { useMemo } from 'react';

import { useStripes } from '@folio/stripes/core';
import { LICENSES_INTERFACE, LICENSES_INTERFACE_VERSION } from '../constants';

// Allow overriding of interfaceVersion just in case
const useHasLicensesInterface = ({ interfaceVersion } = {}) => {
  const stripes = useStripes();

  const licensesInterface = useMemo(() => {
    return stripes.hasInterface(LICENSES_INTERFACE, interfaceVersion ?? LICENSES_INTERFACE_VERSION);
  }, [interfaceVersion, stripes]);

  // hasInterface returns 0 if interface not present *shrug*
  const hasLicensesInterface = useMemo(() => licensesInterface !== 0, [licensesInterface]);

  return ({
    licensesInterface,
    hasLicensesInterface
  });
};

export default useHasLicensesInterface;
