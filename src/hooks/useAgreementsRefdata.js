import { refdataOptions, useRefdata } from '@k-int/stripes-kint-components';
import { REFDATA_ENDPOINT } from '../constants/endpoints';

const useAgreementsRefdata = ({ desc, options = {} }) => {
  return useRefdata({
    desc,
    endpoint: REFDATA_ENDPOINT,
    options: { ...refdataOptions, sort: [{ path: 'desc' }], ...options }
  });
};

export default useAgreementsRefdata;
