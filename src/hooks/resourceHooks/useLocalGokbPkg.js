import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { PACKAGES_ENDPOINT } from '../../constants';

const useLocalGokbPkg = ({ reference }) => {
  const ky = useOkapiKy();
  const remoteId = reference ? reference.split(':')[0] : null;
  const { data } = useQuery(
    ['PKG', 'fetchLocalPkg', remoteId],
    () => ky.get(`${PACKAGES_ENDPOINT}?filters=identifiers.identifier.value==${remoteId}&&identifiers.identifier.ns.value==gokb_id&&identifiers.identifier.status.value==approved`).json(),
    {
      enabled: !!remoteId,
    }
  );

  return data?.[0];
};

export default useLocalGokbPkg;
