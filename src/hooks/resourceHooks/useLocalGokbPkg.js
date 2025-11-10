import { useMemo } from 'react';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import usePackages from './usePackages';

const useLocalGokbPkg = ({ reference }) => {
  const remoteId = reference ? reference.split(':')[0] : null;

  const queryParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        stats: false,
        filters: [
          {
            groupValues: {
              AND: [
                { path: 'identifiers.identifier.value', value: remoteId },
                { path: 'identifiers.identifier.ns.value', value: 'gokb_id' },
                { path: 'identifiers.identifier.status.value', value: 'approved' },
              ],
            },
          },
        ],
      },
      {}
    )
  ), [remoteId]);

  const data = usePackages({ queryParams, queryOptions: { enabled: !!remoteId } });

  return data?.packages?.[0];
};

export default useLocalGokbPkg;
