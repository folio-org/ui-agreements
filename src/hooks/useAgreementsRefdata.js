import orderBy from 'lodash/orderBy';
import { useRefdata, refdataOptions } from '@k-int/stripes-kint-components';

import { REFDATA_ENDPOINT } from '../constants/endpoints';

const useAgreementsRefdata = ({ desc, options = {} } = {}) => {
  const refdata = useRefdata({
    desc,
    endpoint: REFDATA_ENDPOINT,
    options: { ...refdataOptions, sort: [{ path: 'desc' }], ...options },
  });

  const sortedRefData = [...refdata];

  // This may want to be refactored later without the reliance on orderBy
  // If the refdata reteched is in an array, sort the values
  if (Array.isArray(refdata)) {
    for (let index = 0; index < refdata.length; index++) {
      // Order the refdata values in ascending order i.e Author, DFG, Library
      sortedRefData[index].values = orderBy(
        refdata[index].values,
        'value',
        'asc'
      );
    }
  }

  return sortedRefData;
};

export default useAgreementsRefdata;
