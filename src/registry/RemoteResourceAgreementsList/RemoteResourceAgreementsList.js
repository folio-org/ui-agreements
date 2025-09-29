import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';

import EntitlementAgreementsList from '../../components/EntitlementsAgreementsList';

import { ERESOURCE_ENTITLEMENTS_ENDPOINT, TITLES_ELECTRONIC_ENDPOINT } from '../../constants';

const propTypes = {
  remoteId: PropTypes.string.isRequired,
  setBadgeCount: PropTypes.func.isRequired,
};

const RemoteResourceAgreementsList = ({
  remoteId,
  setBadgeCount,
  setLocalEresourceId,
}) => {
  const ky = useOkapiKy();
  let isEmptyMessage;

  const {
    data: eresourceId,
  } = useQuery(
    ['REMOTEKB', 'fetchLocalTitleId', remoteId],
    () => ky.get(`${TITLES_ELECTRONIC_ENDPOINT}?match=identifiers.identifier.value&term=${remoteId}`).json(),
    {
      enabled: !!remoteId,
      // for now only handle the first match
      // TODO: handle multiple TI found with same remote identifier
      select: (d) => d?.[0]?.id ?? null,
      onSuccess: (id) => setLocalEresourceId(id),
      onError: () => setLocalEresourceId(null),
    }
  );

  if (eresourceId === null) {
    isEmptyMessage = <FormattedMessage id="ui-agreements.remoteKb.remoteTitleNotFound" />;
  }

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
    <EntitlementAgreementsList
      entitlements={entitlements}
      eresourceId={eresourceId}
      id="remote-resource-agreements-list"
      isEmptyMessage={isEmptyMessage}
      visibleColumns={['name', 'type', 'startDate', 'endDate', 'eresource', 'acqMethod', 'coverage', 'isCustomCoverage']}
    />
  );
};

RemoteResourceAgreementsList.propTypes = propTypes;

export default RemoteResourceAgreementsList;
