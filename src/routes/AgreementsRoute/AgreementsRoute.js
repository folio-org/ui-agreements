import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import { useTags, useInfiniteFetch, useSingleResultRedirect } from '@folio/stripes-erm-components';

import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import View from '../../components/views/Agreements';
import NoPermissions from '../../components/NoPermissions';
import { getRefdataValuesByDesc, urls } from '../../components/utilities';
import { resultCount } from '../../constants';
import { AGREEMENTS_ENDPOINT } from '../../constants/endpoints';
import { useAgreementsRefdata } from '../../hooks';

const {
  INITIAL_RESULT_COUNT,
} = resultCount;

const [
  AGREEMENT_STATUS,
  RENEWAL_PRIORITY,
  IS_PERPETUAL,
  CONTACT_ROLE,
  ORG_ROLE
] = [
  'SubscriptionAgreement.AgreementStatus',
  'SubscriptionAgreement.RenewalPriority',
  'Global.Yes_No',
  'InternalContact.Role',
  'SubscriptionAgreementOrg.Role',
];

const AgreementsRoute = ({
  children,
  history,
  location,
  match
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-agreements.agreements.view');
  const searchField = useRef();

  // Agreements redirect stuff
  const refdata = useAgreementsRefdata({
    desc: [
      AGREEMENT_STATUS,
      RENEWAL_PRIORITY,
      IS_PERPETUAL,
      CONTACT_ROLE,
      ORG_ROLE
    ]
  });

  const { data: { tags = [] } = {} } = useTags();
  const { query, queryGetter, querySetter } = useKiwtSASQuery();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const agreementsQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,alternateNames.name,description',
      filterKeys: {
        agreementStatus: 'agreementStatus.value',
        contacts: 'contacts.user',
        contactRole: 'contacts.role',
        isPerpetual: 'isPerpetual.value',
        orgs: 'orgs.org',
        renewalPriority: 'renewalPriority.value',
        role: 'orgs.roles.role',
        tags: 'tags.value',
      },
      sortKeys: {
        agreementStatus: 'agreementStatus.label',
      },
      perPage: INITIAL_RESULT_COUNT
    }, (query ?? {}))
  ), [query]);

  const {
    infiniteQueryObject: {
      error: agreementsError,
      fetchNextPage: fetchNextAgreementPage,
      isLoading: areAgreementsLoading,
      isError: isAgreementsError
    },
    results: agreements = [],
    total: agreementsCount = 0
  } = useInfiniteFetch(
    [AGREEMENTS_ENDPOINT, agreementsQueryParams, 'ui-agreements', 'AgreementsRoute', 'getAgreements'],
    ({ pageParam = 0 }) => {
      const params = [...agreementsQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${AGREEMENTS_ENDPOINT}?${params?.join('&')}`)).json();
    }
  );

  // Special hook to redirect if only one result is returned
  useSingleResultRedirect(agreementsCount, agreements?.[0]?.id, urls.agreementView);

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        agreements,
        agreementStatusValues: getRefdataValuesByDesc(refdata, AGREEMENT_STATUS),
        renewalPriorityValues: getRefdataValuesByDesc(refdata, RENEWAL_PRIORITY),
        isPerpetualValues: getRefdataValuesByDesc(refdata, IS_PERPETUAL),
        contactRoleValues: getRefdataValuesByDesc(refdata, CONTACT_ROLE),
        orgRoleValues: getRefdataValuesByDesc(refdata, ORG_ROLE),
        tagsValues: tags,
      }}
      history={history}
      onNeedMoreData={(_askAmount, index) => fetchNextAgreementPage({ pageParam: index })}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchField={searchField}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{ // Fake source from useQuery return values;
        totalCount: () => agreementsCount,
        loaded: () => !areAgreementsLoading,
        pending: () => areAgreementsLoading,
        failure: () => isAgreementsError,
        failureMessage: () => agreementsError.message
      }}
    >
      {children}
    </View>
  );
};

AgreementsRoute.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

AgreementsRoute.manifest = Object.freeze({
  basket: { initialValue: [] },
});

export default stripesConnect(AgreementsRoute);
