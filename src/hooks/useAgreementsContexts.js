
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { CUSTPROP_ENDPOINT } from '../constants';

const useAgreementsContexts = () => {
  const ky = useOkapiKy();

  const path = `${CUSTPROP_ENDPOINT}/contexts`;

  return useQuery(
    [path, 'ui-agreements', 'settings', 'custpropContexts'],
    () => ky(path).json()
  );
};

export default useAgreementsContexts;
