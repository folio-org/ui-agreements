import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { useTags, useInfiniteFetch } from '@folio/stripes-erm-components';

import { generateKiwtQueryParams, useRefdata, refdataOptions } from '@k-int/stripes-kint-components';

import View from '../../components/views/Agreements';
import NoPermissions from '../../components/NoPermissions';
import { getRefdataValuesByDesc, urls } from '../../components/utilities';
import { resultCount } from '../../constants';
import { AGREEMENTS_ENDPOINT, REFDATA_ENDPOINT } from '../../constants/endpoints';

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
  match,
  mutator,
  resources,
  stripes
}) => {
  const ky = useOkapiKy();
  const hasPerms = stripes.hasPerm('ui-agreements.agreements.view');
  const searchField = useRef();

  const refdata = useRefdata({
    desc: [
      AGREEMENT_STATUS,
      RENEWAL_PRIORITY,
      IS_PERPETUAL,
      CONTACT_ROLE,
      ORG_ROLE
    ],
    endpoint: REFDATA_ENDPOINT,
    options: { ...refdataOptions, sort: [{ path: 'desc' }] }
  });

  const { data: { tags = [] } = {} } = useTags();

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
    }, (resources?.query ?? {}))
  ), [resources?.query]);


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

  useEffect(() => {
    if (agreementsCount === 1) {
      history.push(`${urls.agreementView(agreements[0].id)}${location.search}`);
    }
  }, [agreements, agreementsCount, history, location.search]);

  const querySetter = ({ nsValues }) => {
    mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return get(resources, 'query', {});
  };

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
  mutator: PropTypes.object,
  resources: PropTypes.object,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    logger: PropTypes.object,
  }),
};

AgreementsRoute.manifest = Object.freeze({
  basket: { initialValue: [] },
  query: { initialValue: {} },
});

export default stripesConnect(AgreementsRoute, { dataKey: 'agreementsRoute' });
