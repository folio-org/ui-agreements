import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { cloneDeep, chunk } from 'lodash';
import compose from 'compose-function';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { refdataOptions, useRefdata } from '@k-int/stripes-kint-components';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import { useBatchedFetch, useUsers, withAsyncValidation } from '@folio/stripes-erm-components';

import withFileHandlers from '../components/withFileHandlers';
import { joinRelatedAgreements, splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { getRefdataValuesByDesc, urls } from '../../components/utilities';
import { endpoints, resultCount } from '../../constants';
import { useChunkedOrderLines } from '../../hooks';

const { RECORDS_PER_REQUEST_LARGE } = resultCount;
const { AGREEMENTS_ENDPOINT, AGREEMENT_ENDPOINT, AGREEMENT_LINES_ENDPOINT, REFDATA_ENDPOINT } = endpoints;

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

const AgreementEditRoute = ({
  checkAsyncValidation,
  handlers = {},
  history,
  location,
  match: { params: { id: agreementId } },
  mutator,
  resources
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const callout = useContext(CalloutContext);
  const stripes = useStripes();

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

  const { data: agreement, isLoading: isAgreementLoading } = useQuery(
    [AGREEMENT_ENDPOINT(agreementId), 'getAgreement'],
    () => ky.get(AGREEMENT_ENDPOINT(agreementId)).json()
  );

  // AGREEMENT LINES BATCHED FETCH
  const {
    results: agreementLines,
    total: agreementLineCount,
    isLoading: areLinesLoading
  } = useBatchedFetch({
    batchParams:  {
      filters: [
        {
          path: 'owner',
          value: agreementId
        }
      ],
      sort: [
        { path: 'type' },
        { path: 'resource.name' },
        { path: 'reference' },
        { path: 'id' }
      ],
    },
    path: AGREEMENT_LINES_ENDPOINT
  });

  // Users
  const { data: { users = [] } = {} } = useUsers(agreement?.contacts.filter(c => c.user)?.map(c => c.user));

  const { mutateAsync: putAgreement } = useMutation(
    [AGREEMENT_ENDPOINT(agreementId), 'ui-agreements', 'AgreementEditRoute', 'editAgreement'],
    (payload) => ky.put(AGREEMENT_ENDPOINT(agreementId), { json: payload }).json()
      .then(({ name }) => {
        /* Invalidate cached queries */
        queryClient.invalidateQueries(AGREEMENTS_ENDPOINT);
        queryClient.invalidateQueries(AGREEMENT_ENDPOINT(agreementId));

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.agreements.update.callout" values={{ name }} /> });
        history.push(`${urls.agreementView(agreementId)}${location.search}`);
      })
  );

  const getInitialValues = useCallback(() => { // TODO really not sure about this initialValues handling
    let initialValues = {};

    if (agreement.id === agreementId) { // Not sure what this protects against right now
      initialValues = cloneDeep(agreement);
    }

    const {
      agreementStatus = {},
      contacts = [],
      isPerpetual = {},
      items = [],
      linkedLicenses = [],
      orgs = [],
      reasonForClosure = {},
      renewalPriority = {},
      supplementaryDocs = [],
    } = initialValues;

    // Set the values of dropdown-controlled props as values rather than objects.
    initialValues.agreementStatus = agreementStatus.value;
    initialValues.isPerpetual = isPerpetual.value;
    initialValues.reasonForClosure = reasonForClosure.value;
    initialValues.renewalPriority = renewalPriority.value;
    initialValues.contacts = contacts.map(c => ({ ...c, role: c.role.value }));
    initialValues.orgs = orgs.map(o => ({ ...o, role: o.role && o.role.value }));
    initialValues.supplementaryDocs = supplementaryDocs.map(o => ({ ...o, atType: o.atType?.value }));
    initialValues.linkedLicenses = linkedLicenses.map(l => ({
      ...l,
      status: l.status.value,
      // Init the list of amendments based on the license's amendments to ensure
      // we display those that have been created since this agreement's license was last
      // edited. Ensure we provide defaults via amendmentId.
      // eslint-disable-next-line camelcase
      amendments: (l?.remoteId_object?.amendments ?? [])
        .map(a => {
          const assignedAmendment = (l.amendments || []).find(la => la.amendmentId === a.id) || {};
          return {
            ...assignedAmendment,
            amendmentId: a.id,
            status: assignedAmendment.status ? assignedAmendment.status.value : undefined,
          };
        })
    }));

    joinRelatedAgreements(initialValues);

    // Check agreement lines correspond to this agreement
    if (!areLinesLoading && items.length && agreementLineCount && (agreementLines[0].owner.id === agreementId)) {
      initialValues.items = items.map(item => {
        // We weed out any external entitlements, then map the internal ones to our form shape
        if (item.resource) return item;

        const line = agreementLines.find(l => l.id === item.id);
        if (!line) return item;

        return {
          id: line.id,
          coverage: line.customCoverage ? line.coverage : undefined,
          poLines: line.poLines,
          activeFrom: line.startDate,
          activeTo: line.endDate,
          note: line.note
        };
      });
    }

    return initialValues;
  }, [agreement, agreementId, agreementLineCount, agreementLines, areLinesLoading]);

  /*
   * Calculate poLineIdsArray outside of the useEffect hook,
   * so we can accurately tell if it changes and avoid infinite loop
   */
  const poLineIdsArray = useMemo(() => (
    agreementLines
      .filter(line => line.poLines && line.poLines.length)
      .map(line => (line.poLines.map(poLine => poLine.poLineId))).flat()
  ), [agreementLines]);

  const { orderLines, isLoading: areOrderLinesLoading } = useChunkedOrderLines(poLineIdsArray);

  const handleBasketLinesAdded = () => {
    mutator.query.update({
      addFromBasket: null,
      authority: null,
      referenceId: null,
    });
  };

  const handleClose = () => {
    history.push(`${urls.agreementView(agreementId)}${location.search}`);
  };

  const handleSubmit = (values) => {
    const relationshipTypeValues = getRefdataValuesByDesc(refdata, RELATIONSHIP_TYPE);
    splitRelatedAgreements(values, relationshipTypeValues);

    putAgreement(values);
  };

  const getAgreementLinesToAdd = () => {
    const { query: { addFromBasket } } = resources;

    let basketLines = [];
    if (resources.query.addFromBasket) {
      const basket = resources?.basket ?? [];

      basketLines = addFromBasket
        .split(',')
        .map(index => ({ resource: basket[parseInt(index, 10)] }))
        .filter(line => line.resource); // sanity check that there _was_ an item at that index
    }

    return [
      ...basketLines,
    ];
  };

  const getAgreementLines = () => {
    return [
      ...agreementLines,
      ...getAgreementLinesToAdd(),
    ];
  };

  const fetchIsPending = () => {
    return resources?.orderLines?.isPending || isAgreementLoading;
  };

  if (!stripes.hasPerm('ui-agreements.agreements.edit')) return <NoPermissions />;
  if (fetchIsPending() || areOrderLinesLoading) return <LoadingView dismissible onClose={handleClose} />;

  return (
    <View
      data={{
        agreementLines: getAgreementLines(),
        agreementLinesToAdd: getAgreementLinesToAdd(),
        agreementStatusValues: getRefdataValuesByDesc(refdata, AGREEMENT_STATUS),
        reasonForClosureValues: getRefdataValuesByDesc(refdata, REASON_FOR_CLOSURE),
        amendmentStatusValues: getRefdataValuesByDesc(refdata, AMENDMENT_STATUS),
        basket: resources?.basket ?? [],
        contactRoleValues: getRefdataValuesByDesc(refdata, CONTACT_ROLE),
        documentCategories: getRefdataValuesByDesc(refdata, DOC_ATTACHMENT_TYPE),
        isPerpetualValues: getRefdataValuesByDesc(refdata, IS_PERPETUAL),
        licenseLinkStatusValues: getRefdataValuesByDesc(refdata, REMOTE_LICENSE_LINK_STATUS),
        orderLines,
        acquisitionMethod: resources?.acquisitionMethod?.records ?? [],
        orgRoleValues: getRefdataValuesByDesc(refdata, ORG_ROLE),
        renewalPriorityValues: getRefdataValuesByDesc(refdata, RENEWAL_PRIORITY),
        users,
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

export default compose(
  withFileHandlers,
  withAsyncValidation,
  stripesConnect
)(AgreementEditRoute);

AgreementEditRoute.manifest = Object.freeze({
  acquisitionMethod: {
    type: 'okapi',
    path: 'orders/acquisition-methods',
    accumulate: true,
    fetch: false,
    perRequest: 1000,
    records: 'acquisitionMethods',
  },
  orderLines: {
    type: 'okapi',
    perRequest: RECORDS_PER_REQUEST_LARGE,
    path: 'orders/order-lines',
    accumulate: 'true',
    fetch: false,   // we will fetch the order lines in the componentDidMount
    records: 'poLines',
  },
  basket: { initialValue: [] },
  query: { initialValue: {} },
});

AgreementEditRoute.propTypes = {
  checkAsyncValidation: PropTypes.func,
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    orderLines: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    acquisitionMethod: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    query: PropTypes.shape({
      update: PropTypes.func.isRequired
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
    orderLines: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
      isPending: PropTypes.bool
    }),
    acquisitionMethod: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    query: PropTypes.shape({
      addFromBasket: PropTypes.string,
    }),
  }).isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};
