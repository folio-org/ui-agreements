import React, { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { cloneDeep } from 'lodash';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useBatchedFetch, useUsers } from '@folio/stripes-erm-components';

import { joinRelatedAgreements, splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { endpoints } from '../../constants';
import { useAddFromBasket, useAgreementsRefdata, useChunkedOrderLines } from '../../hooks';

const { AGREEMENT_ENDPOINT, AGREEMENT_LINES_ENDPOINT } = endpoints;

const [
  AGREEMENT_STATUS,
  REASON_FOR_CLOSURE,
  AMENDMENT_STATUS,
  CONTACT_ROLE,
  DOC_ATTACHMENT_TYPE,
  GLOBAL_YES_NO,
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
  'Global.Yes_No', // We use Global.Yes_No for IsPerpetual
  'RemoteLicenseLink.Status',
  'SubscriptionAgreementOrg.Role',
  'SubscriptionAgreement.RenewalPriority',
  'AgreementRelationship.Type'
];

const AgreementEditRoute = ({
  handlers = {},
  history,
  location,
  match: { params: { id: agreementId } },
  resources
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const callout = useContext(CalloutContext);
  const stripes = useStripes();

  const {
    handleBasketLinesAdded,
    getAgreementLinesToAdd
  } = useAddFromBasket(resources?.basket);

  const refdata = useAgreementsRefdata({
    desc: [
      AGREEMENT_STATUS,
      REASON_FOR_CLOSURE,
      AMENDMENT_STATUS,
      CONTACT_ROLE,
      DOC_ATTACHMENT_TYPE,
      GLOBAL_YES_NO,
      REMOTE_LICENSE_LINK_STATUS,
      ORG_ROLE,
      RENEWAL_PRIORITY,
      RELATIONSHIP_TYPE
    ]
  });

  const { data: agreement, isLoading: isAgreementLoading } = useQuery(
    ['ERM', 'Agreement', agreementId, AGREEMENT_ENDPOINT(agreementId)], // This pattern may need to be expanded to other fetches in Nolana
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
    nsArray: ['ERM', 'Agreement', agreementId, 'AgreementLines', AGREEMENT_LINES_ENDPOINT, 'AgreementEditRoute'],
    path: AGREEMENT_LINES_ENDPOINT
  });

  // Users
  const { data: { users = [] } = {} } = useUsers(agreement?.contacts?.filter(c => c.user)?.map(c => c.user));

  const { mutateAsync: putAgreement } = useMutation(
    [AGREEMENT_ENDPOINT(agreementId), 'ui-agreements', 'AgreementEditRoute', 'editAgreement'],
    (payload) => ky.put(AGREEMENT_ENDPOINT(agreementId), { json: payload }).json()
      .then(({ name, linkedLicenses }) => {
        // Invalidate any linked license's linkedAgreements calls
        if (linkedLicenses?.length) {
          linkedLicenses.forEach(linkLic => {
            // I'm still not 100% sure this is the "right" way to go about this.
            queryClient.invalidateQueries(['ERM', 'License', linkLic?.id, 'LinkedAgreements']); // This is a convention adopted in licenses
          });
        }

        /* Invalidate cached queries */
        queryClient.invalidateQueries(['ERM', 'Agreements']);
        queryClient.invalidateQueries(['ERM', 'Agreement', agreementId]);

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.agreements.update.callout" values={{ name }} /> });
        history.push(`${urls.agreementView(agreementId)}${location.search}`);
      })
  );

  const getInitialValues = useCallback(() => {
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

  const handleClose = () => {
    history.push(`${urls.agreementView(agreementId)}${location.search}`);
  };

  const handleSubmit = (values) => {
    const relationshipTypeValues = getRefdataValuesByDesc(refdata, RELATIONSHIP_TYPE);
    splitRelatedAgreements(values, relationshipTypeValues);

    putAgreement(values);
  };

  const getAgreementLines = () => {
    return [
      ...agreementLines,
      ...getAgreementLinesToAdd(),
    ];
  };

  const fetchIsPending = () => {
    return areOrderLinesLoading || isAgreementLoading;
  };

  if (!stripes.hasPerm('ui-agreements.agreements.edit')) return <NoPermissions />;
  if (fetchIsPending()) return <LoadingView dismissible onClose={handleClose} />;

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
        isPerpetualValues: getRefdataValuesByDesc(refdata, GLOBAL_YES_NO),
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
        onClose: handleClose,
      }}
      initialValues={getInitialValues()}
      isLoading={fetchIsPending()}
      onSubmit={handleSubmit}
    />
  );
};

export default stripesConnect(AgreementEditRoute);

AgreementEditRoute.manifest = Object.freeze({
  acquisitionMethod: {
    type: 'okapi',
    path: 'orders/acquisition-methods',
    accumulate: true,
    fetch: false,
    perRequest: 1000,
    records: 'acquisitionMethods',
  },
  // TODO we don't want to be using this, see https://issues.folio.org/browse/ERM-2183
  basket: { initialValue: [] },
});

AgreementEditRoute.propTypes = {
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
    acquisitionMethod: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
  }).isRequired,
  resources: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
    acquisitionMethod: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};
