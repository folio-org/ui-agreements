import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';

import { generateKiwtQueryParams, usePrevNextPagination } from '@k-int/stripes-kint-components';
import EntitlementAgreementsList from '../../components/EntitlementsAgreementsList';

import {
  ERESOURCE_ENTITLEMENTS_ENDPOINT,
  TITLES_ELECTRONIC_ENDPOINT,
  ENTITLEMENT_AGREEMENTS_LIST_PAGINATION_ID
} from '../../constants';

import { useAgreementsDisplaySettings } from '../../hooks';
import { parseMclPageSize } from '../../components/utilities';

const propTypes = {
  remoteId: PropTypes.string.isRequired,
  setBadgeCount: PropTypes.func.isRequired,
};

const RemoteResourceAgreementsList = ({
  remoteId,
  setBadgeCount,
}) => {
  const ky = useOkapiKy();

  const { data: eresourceId } = useQuery(
    ['REMOTEKB', 'fetchLocalTitleId', remoteId],
    () => ky.get(`${TITLES_ELECTRONIC_ENDPOINT}?match=identifiers.identifier.value&term=${remoteId}`).json(),
    {
      enabled: !!remoteId,
      // for now only handle the first match
      // TODO: handle multiple TI found with same remote identifier
      select: (d) => d?.[0]?.id ?? null,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const settings = useAgreementsDisplaySettings({ namespaceAppend: ['entitlementAgreements'] });
  const pageSize = parseMclPageSize(settings, 'entitlements');
  const paginationId = `${ENTITLEMENT_AGREEMENTS_LIST_PAGINATION_ID}-${eresourceId || 'pending'}`;

  const { currentPage } = usePrevNextPagination({
    pageSize,
    id: paginationId,
    syncToLocation: false
  });

  const queryParams = generateKiwtQueryParams({ page: currentPage, perPage: pageSize }, {});

  const { data: { results: entitlements = [], totalRecords: entitlementsCount = 0 } = {} } = useQuery(
    ['REMOTEKB', 'fetchEntitlementsForTitle', eresourceId, queryParams],
    () => {
      const params = [...queryParams];
      return ky.get(`${ERESOURCE_ENTITLEMENTS_ENDPOINT(eresourceId)}?${params.join('&')}`).json();
    },
    {
      enabled: !!eresourceId && !!currentPage && !!pageSize,
      onSuccess: (data) => {
        const count = Array.isArray(data) ? data.length : (data?.totalRecords ?? 0);
        setBadgeCount(count);
      },
      onError: () => {
        setBadgeCount(0);
      },
    }
  );

  return (
    eresourceId ?
      <EntitlementAgreementsList
        entitlements={entitlements}
        eresourceId={eresourceId}
        id="remote-resource-agreements-list"
        totalCount={entitlementsCount}
        visibleColumns={['name', 'type', 'startDate', 'endDate', 'eresource', 'acqMethod', 'coverage', 'isCustomCoverage']}
      />
      : <FormattedMessage id="ui-agreements.remoteKb.remoteTitleNotFound" />
  );
};

RemoteResourceAgreementsList.propTypes = propTypes;

export default RemoteResourceAgreementsList;
