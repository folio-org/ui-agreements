import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  generateKiwtQueryParams,
  useKiwtSASQuery,
} from '@k-int/stripes-kint-components';

import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import {
  getRefdataValuesByDesc,
  useTags,
  useSASQQIndex,
  usePrevNextPagination,
} from '@folio/stripes-erm-components';

import View from '../../components/views/Agreements';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import {
  AGREEMENTS_ENDPOINT,
  defaultAgreementsQIndex as defaultQIndex,
  resultCount,
} from '../../constants';
import { useAgreementsRefdata } from '../../hooks';

const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const [
  AGREEMENT_STATUS,
  REASON_FOR_CLOSURE,
  RENEWAL_PRIORITY,
  IS_PERPETUAL,
  CONTACT_ROLE,
  ORG_ROLE,
  AGREEMENT_CONTENT_TYPE,
  DOCUMENT_AT_TYPE,
] = [
  'SubscriptionAgreement.AgreementStatus',
  'SubscriptionAgreement.ReasonForClosure',
  'SubscriptionAgreement.RenewalPriority',
  'Global.Yes_No',
  'InternalContact.Role',
  'SubscriptionAgreementOrg.Role',
  'SubscriptionAgreement.ContentType',
  'DocumentAttachment.AtType',
];

const AgreementsRoute = ({ children, history, location, match }) => {
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
      ORG_ROLE,
      AGREEMENT_CONTENT_TYPE,
      DOCUMENT_AT_TYPE
    ],
  });

  const { data: { tags = [] } = {} } = useTags();
  const { query, queryGetter, querySetter } = useKiwtSASQuery();

  const { currentPage } = usePrevNextPagination();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const { searchKey } = useSASQQIndex({ defaultQIndex });

  const agreementsQueryParams = useMemo(
    () => generateKiwtQueryParams(
      {
        /* There were problems with using truthiness ?? on an empty string '' */
        searchKey,
        filterKeys: {
          agreementContentType: 'agreementContentTypes.contentType.value',
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
        page: currentPage,
        perPage: RESULT_COUNT_INCREMENT_MEDIUM,
      },
      query ?? {}
    ),
    [query, searchKey, currentPage]
  );

  const {
    data: { results: agreements = [], totalRecords: agreementsCount = 0 } = {},
    error: agreementsError,
    isLoading: areAgreementsLoading,
    isError: isAgreementsError,
  } = useQuery(
    ['ERM', 'Agreements', agreementsQueryParams, AGREEMENTS_ENDPOINT],
    () => {
      const params = [...agreementsQueryParams];
      return ky.get(`${AGREEMENTS_ENDPOINT}?${params?.join('&')}`).json();
    },
    {
      enabled: !!currentPage,
    }
  );

  useEffect(() => {
    if (agreementsCount === 1) {
      const newUrl = `${urls.agreementView(agreements[0].id)}${location.search}`;

      if (`${location.pathname}${location.search}` !== newUrl) {
        history.push(newUrl);
      }
    }
  }, [agreements, agreementsCount, history, location.pathname, location.search]);

  if (!hasPerms) return <NoPermissions />;

  return (
    <View
      data={{
        agreements,
        agreementStatusValues: getRefdataValuesByDesc(
          refdata,
          AGREEMENT_STATUS
        ),
        reasonForClosureValues: getRefdataValuesByDesc(
          refdata,
          REASON_FOR_CLOSURE
        ),
        renewalPriorityValues: getRefdataValuesByDesc(
          refdata,
          RENEWAL_PRIORITY
        ),
        isPerpetualValues: getRefdataValuesByDesc(refdata, IS_PERPETUAL),
        contactRoleValues: getRefdataValuesByDesc(refdata, CONTACT_ROLE),
        orgRoleValues: getRefdataValuesByDesc(refdata, ORG_ROLE),
        agreementContentTypeValues: getRefdataValuesByDesc(
          refdata,
          AGREEMENT_CONTENT_TYPE
        ),
        documentAtTypeValues: getRefdataValuesByDesc(refdata, DOCUMENT_AT_TYPE),
        tagsValues: tags,
      }}
      history={history}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchField={searchField}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{
        // Fake source from useQuery return values;
        totalCount: () => agreementsCount,
        loaded: () => !areAgreementsLoading,
        pending: () => areAgreementsLoading,
        failure: () => isAgreementsError,
        failureMessage: () => agreementsError.message,
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
