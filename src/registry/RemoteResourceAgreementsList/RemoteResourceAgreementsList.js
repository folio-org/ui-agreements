// import { useEffect } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { useOkapiKy } from '@folio/stripes/core';

import { EntitlementAgreementsBaseList } from '../../components/EntitlementsAgreementsList';

import { ERESOURCE_ENTITLEMENTS_ENDPOINT, TITLES_ELECTRONIC_ENDPOINT } from '../../constants';

const propTypes = {
  remoteId: PropTypes.string.isRequired,
  setBadgeCount: PropTypes.func.isRequired,
};

const RemoteResourceAgreementsList = ({
  remoteId,
  setBadgeCount
}) => {
  const ky = useOkapiKy();

  const {
    data: eresourceId,
  } = useQuery(
    ['REMOTEKB', 'fetchLocalTitleId', remoteId],
    () => ky.get(`${TITLES_ELECTRONIC_ENDPOINT}?match=identifiers.identifier.value&term=${remoteId}`).json(),
    {
      enabled: !!remoteId,
      select: (d) => d?.[0]?.id ?? null,
    }
  );

  const {
    data: entitlements = [],
  } = useQuery(
    ['REMOTEKB', 'fetchEntitlementsForTitle', eresourceId],
    () => ky.get(ERESOURCE_ENTITLEMENTS_ENDPOINT(eresourceId)).json(),
    {
      enabled: !!eresourceId,
      onSuccess: (data) => {
        setBadgeCount(Array.isArray(data) ? data.length : 0);
      },
      onError: () => {
        setBadgeCount(0);
      },
    }
  );

  return (
    <EntitlementAgreementsBaseList
      entitlements={entitlements}
      eresourceId={eresourceId}
      id="remote-resource-agreements-list"
      visibleColumns={['name', 'type', 'startDate', 'endDate', 'eresource', 'acqMethod', 'coverage', 'isCustomCoverage']}
    />
  );
};

RemoteResourceAgreementsList.propTypes = propTypes;

export default RemoteResourceAgreementsList;
