import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useTags, useInfiniteFetch } from '@folio/stripes-erm-components';

import { generateKiwtQueryParams, useKiwtSASQuery, useQIndex } from '@k-int/stripes-kint-components';

import View from '../../components/views/Agreements';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { defaultQIndex, resultCount } from '../../constants';
import { AGREEMENTS_ENDPOINT } from '../../constants/endpoints';
import { useAgreementsRefdata } from '../../hooks';

const {
  INITIAL_RESULT_COUNT,
} = resultCount;

const [
  AGREEMENT_STATUS,
  REASON_FOR_CLOSURE,
  RENEWAL_PRIORITY,
  IS_PERPETUAL,
  CONTACT_ROLE,
  ORG_ROLE
] = [
  'SubscriptionAgreement.AgreementStatus',
  'SubscriptionAgreement.ReasonForClosure',
  'SubscriptionAgreement.RenewalPriority',
  'Global.Yes_No',
  'InternalContact.Role',
  'SubscriptionAgreementOrg.Role',
];

const AgreementsRoute = ({
  children,
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const hasPerms = stripes.hasPerm('ui-agreements.agreements.view');
  const searchField = useRef();

  const refdata = useAgreementsRefdata({
    desc: [
      AGREEMENT_STATUS,
      REASON_FOR_CLOSURE,
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

  const { 0: qIndex } = useQIndex(); // We don't need the setter here;

  const agreementsQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      /* There were problems with using truthiness ?? on an empty string '' */
      searchKey: (!!qIndex && qIndex !== '') ? qIndex : defaultQIndex,
      filterKeys: {
        agreementStatus: 'agreementStatus.value',
        contacts: 'contacts.user',
        contactRole: 'contacts.role',
        isPerpetual: 'isPerpetual.value',
        orgs: 'orgs.org',
        reasonForClosure: 'reasonForClosure.value',
        renewalPriority: 'renewalPriority.value',
        role: 'orgs.roles.role',
        tags: 'tags.value',
      },
      sortKeys: {
        agreementStatus: 'agreementStatus.label',
      },
      perPage: INITIAL_RESULT_COUNT
    }, (query ?? {}))
  ), [qIndex, query]);

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
    ['ERM', 'Agreements', agreementsQueryParams, AGREEMENTS_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...agreementsQueryParams, `offset=${pageParam}`];
      return ky.get(`${AGREEMENTS_ENDPOINT}?${params?.join('&')}`).json();
    }
  );

  useEffect(() => {
    if (agreementsCount === 1) {
      history.push(`${urls.agreementView(agreements[0].id)}${location.search}`);
    }
  }, [agreements, agreementsCount, history, location.search]);

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        agreements,
        agreementStatusValues: getRefdataValuesByDesc(refdata, AGREEMENT_STATUS),
        reasonForClosureValues: getRefdataValuesByDesc(refdata, REASON_FOR_CLOSURE),
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

export default AgreementsRoute;
