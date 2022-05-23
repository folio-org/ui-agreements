import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import isEqual from 'lodash/isEqual';

import compose from 'compose-function';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { refdataOptions, useRefdata } from '@k-int/stripes-kint-components';

import queryString from 'query-string';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';

import { withAsyncValidation } from '@folio/stripes-erm-components';
import withFileHandlers from '../components/withFileHandlers';
import { splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { getRefdataValuesByDesc, urls } from '../../components/utilities';
import { AGREEMENTS_ENDPOINT, AGREEMENT_LINES_EXTERNAL_ENDPOINT, REFDATA_ENDPOINT } from '../../constants/endpoints';

const [
  AGREEMENT_STATUS,
  REASON_FOR_CLOSURE,
  AMENDMENT_STATUS,
  CONTACT_ROLE,
  DOC_ATTACHMENT_TYPE,
  IS_PERPETUAL,
  REMOTE_LICENSE_LINK_STATUS,
  ORG_ROLE,
  RENEWAL_PRIORITY,
  RELATIONSHIP_TYPE
] = [
  'SubscriptionAgreement.AgreementStatus',
  'SubscriptionAgreement.ReasonForClosure',
  'LicenseAmendmentStatus.Status',
  'InternalContact.Role',
  'DocumentAttachment.AtType',
  'SubscriptionAgreement.IsPerpetual',
  'RemoteLicenseLink.Status',
  'SubscriptionAgreementOrg.Role',
  'SubscriptionAgreement.RenewalPriority',
  'AgreementRelationship.Type'
];

const AgreementCreateRoute = ({
  checkAsyncValidation,
  handlers = {},
  history,
  location,
  resources
}) => {
  const { authority, referenceId } = queryString.parse(location?.search);
  const [query, setQuery] = useState(queryString.parse(location?.search));

  // TODO on Monday, look into hookifying this into a single solution
  useEffect(() => {
    const newQuery = queryString.parse(location.search);
    if (!isEqual(newQuery, query)
    ) {
      setQuery(newQuery);
    }
  }, [location.search, query]);

  const callout = useContext(CalloutContext);
  const stripes = useStripes();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const refdata = useRefdata({
    desc: [
      AGREEMENT_STATUS,
      REASON_FOR_CLOSURE,
      AMENDMENT_STATUS,
      CONTACT_ROLE,
      DOC_ATTACHMENT_TYPE,
      IS_PERPETUAL,
      REMOTE_LICENSE_LINK_STATUS,
      ORG_ROLE,
      RENEWAL_PRIORITY,
      RELATIONSHIP_TYPE
    ],
    endpoint: REFDATA_ENDPOINT,
    options: { ...refdataOptions, sort: [{ path: 'desc' }] }
  });

  const { mutateAsync: postAgreement } = useMutation(
    [AGREEMENTS_ENDPOINT, 'ui-agreements', 'AgreementCreateRoute', 'createAgreement'],
    (payload) => ky.post(AGREEMENTS_ENDPOINT, { json: payload }).json()
      .then(({ id }) => {
        /* Invalidate cached queries */
        queryClient.invalidateQueries(AGREEMENTS_ENDPOINT);

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.agreements.create.callout" values={{ name }} /> });
        history.push(`${urls.agreementView(id)}${location.search}`);
      })
  );

  const getExternalEntitlementQuery = useCallback(() => {
    const queryArray = [];

    if (authority) {
      queryArray.push(`authority=${authority}`)
    }

    if (referenceId) {
      queryArray.push(`reference=${referenceId}`)
    }


    if (queryArray.length) {
      return `?${queryArray.join('&')}`;
    }
    return '';
  }, [authority, referenceId]);

  const { data: externalEntitlement, isLoading: isExternalEntitlementLoading } = useQuery(
    [AGREEMENT_LINES_EXTERNAL_ENDPOINT, authority, referenceId, 'AgreementCreateRoute', 'getExternalEntitlements'],
    () => ky.get(`${AGREEMENT_LINES_EXTERNAL_ENDPOINT}${getExternalEntitlementQuery()}`).json(),
    {
      enabled: (!!referenceId || !!authority)
    }
  );

  const handleBasketLinesAdded = () => {
    // This is a replacement of the old "query" management we had previously.
    // This could be centralised
    history.push({
      pathname: location.pathname,
      search: ''
    });
  };

  const handleClose = () => {
    history.push(`${urls.agreements()}${location.search}`);
  };

  const handleSubmit = (agreement) => {
    const relationshipTypeValues = getRefdataValuesByDesc(refdata, RELATIONSHIP_TYPE);

    splitRelatedAgreements(agreement, relationshipTypeValues);

    postAgreement(agreement);
  };

  const getAgreementLinesToAdd = () => {
    const linesToAdd = [];

    let basketLines = [];
    if (query.addFromBasket) {
      const basket = resources?.basket ?? [];

      basketLines = query.addFromBasket
        .split(',')
        .map(index => ({ resource: basket[parseInt(index, 10)] }))
        .filter(line => line.resource); // check that there _was_ a basket item at that index
    }

    if (externalEntitlement) {
      linesToAdd.push(externalEntitlement)
    }

    linesToAdd.push(...basketLines);


    return linesToAdd;
  };

  const fetchIsPending = () => {
    return resources?.basket?.isPending || isExternalEntitlementLoading;
  };

  const getInitialValues = () => {
    const periods = [{}];

    return {
      periods,
    };
  };

  if (!stripes.hasPerm('ui-agreements.agreements.edit')) return <NoPermissions />;
  if (fetchIsPending()) return <LoadingView dismissible onClose={handleClose} />;

  return (
    <View
      data={{
        agreementLines: getAgreementLinesToAdd(),
        agreementLinesToAdd: getAgreementLinesToAdd(),
        agreementStatusValues: getRefdataValuesByDesc(refdata, AGREEMENT_STATUS),
        reasonForClosureValues: getRefdataValuesByDesc(refdata, REASON_FOR_CLOSURE),
        amendmentStatusValues: getRefdataValuesByDesc(refdata, AMENDMENT_STATUS),
        basket: (resources?.basket ?? []),
        contactRoleValues: getRefdataValuesByDesc(refdata, CONTACT_ROLE),
        documentCategories: getRefdataValuesByDesc(refdata, DOC_ATTACHMENT_TYPE),
        isPerpetualValues: getRefdataValuesByDesc(refdata, IS_PERPETUAL),
        licenseLinkStatusValues: getRefdataValuesByDesc(refdata, REMOTE_LICENSE_LINK_STATUS),
        orgRoleValues: getRefdataValuesByDesc(refdata, ORG_ROLE),
        renewalPriorityValues: getRefdataValuesByDesc(refdata, RENEWAL_PRIORITY),
        users: [],
      }}
      handlers={{
        ...handlers,
        onBasketLinesAdded: handleBasketLinesAdded,
        onAsyncValidate: checkAsyncValidation,
        onClose: handleClose,
      }}
      initialValues={getInitialValues()}
      isLoading={fetchIsPending()}
      onSubmit={handleSubmit}
    />
  );
};

AgreementCreateRoute.manifest = Object.freeze({
  basket: { initialValue: [] },
});

AgreementCreateRoute.propTypes = {
  checkAsyncValidation: PropTypes.func,
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default compose(
  withFileHandlers,
  withAsyncValidation,
  stripesConnect
)(AgreementCreateRoute);
