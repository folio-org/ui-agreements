import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQueryClient } from 'react-query';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc } from '@folio/stripes-erm-components';

import { splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { AGREEMENTS_ENDPOINT } from '../../constants/endpoints';
import { useAddFromBasket, useAgreementsRefdata } from '../../hooks';

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
  handlers = {},
  history,
  location,
  resources
}) => {
  const callout = useContext(CalloutContext);
  const stripes = useStripes();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const {
    handleBasketLinesAdded,
    isExternalEntitlementLoading,
    getAgreementLinesToAdd
  } = useAddFromBasket(resources?.basket);

  const refdata = useAgreementsRefdata({
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
    ]
  });

  const { mutateAsync: postAgreement } = useMutation(
    [AGREEMENTS_ENDPOINT, 'ui-agreements', 'AgreementCreateRoute', 'createAgreement'],
    (payload) => ky.post(AGREEMENTS_ENDPOINT, { json: payload }).json()
      .then(({ id, name, linkedLicenses }) => {
        // Invalidate any linked license's linkedAgreements calls
        if (linkedLicenses.length) {
          linkedLicenses.forEach(linkLic => {
            // I'm still not 100% sure this is the "right" way to go about this.
            queryClient.invalidateQueries(['ERM', 'License', linkLic?.id, 'LinkedAgreements']); // This is a convention adopted in licenses
          });
        }
        /* Invalidate cached queries */
        queryClient.invalidateQueries(AGREEMENTS_ENDPOINT);

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.agreements.create.callout" values={{ name }} /> });
        history.push(`${urls.agreementView(id)}${location.search}`);
      })
  );

  const handleClose = () => {
    history.push(`${urls.agreements()}${location.search}`);
  };

  const handleSubmit = (agreement) => {
    const relationshipTypeValues = getRefdataValuesByDesc(refdata, RELATIONSHIP_TYPE);

    splitRelatedAgreements(agreement, relationshipTypeValues);

    postAgreement(agreement);
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
        onClose: handleClose,
      }}
      initialValues={getInitialValues()}
      isLoading={fetchIsPending()}
      onSubmit={handleSubmit}
    />
  );
};

AgreementCreateRoute.manifest = Object.freeze({
  // TODO we don't want to be using this, see https://issues.folio.org/browse/ERM-2183
  basket: { initialValue: [] },
});

AgreementCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired
  }).isRequired,
  resources: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(AgreementCreateRoute);
