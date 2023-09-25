import orderBy from 'lodash/orderBy';
import { useRefdata, refdataOptions } from '@k-int/stripes-kint-components';

import { REFDATA_ENDPOINT } from '../constants';

const sortRefdata = (refdataData) => {
  const sortedRefData = [...(refdataData ?? [])];
  if (Array.isArray(refdataData)) {
    for (let index = 0; index < refdataData.length; index++) {
      // Order the refdata values in ascending order i.e Author, DFG, Library
      sortedRefData[index].values = orderBy(
        refdataData[index].values,
        'value',
        'asc'
      );
    }
  }

  return sortedRefData;
};

const useAgreementsRefdata = ({ desc, options = {}, returnQueryObject = false } = {}) => {
  const refdata = useRefdata({
    desc,
    endpoint: REFDATA_ENDPOINT,
    options: { ...refdataOptions, sort: [{ path: 'desc' }], ...options },
    returnQueryObject
  });

  if (returnQueryObject) {
    const { data: refdataData, ...rest } = refdata;
    const sortedData = sortRefdata(refdataData);

    return ({
      data: sortedData,
      ...rest
    });
  }

  return sortRefdata(refdata);
};

export default useAgreementsRefdata;
