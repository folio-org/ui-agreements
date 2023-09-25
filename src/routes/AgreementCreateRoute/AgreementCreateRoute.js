import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQueryClient } from 'react-query';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, useOkapiKy, useStripes } from '@folio/stripes/core';
import { getRefdataValuesByDesc } from '@folio/stripes-erm-components';

import queryString from 'query-string';
import { splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import { AGREEMENTS_ENDPOINT } from '../../constants';
import { useAddFromBasket, useAgreementsRefdata, useBasket } from '../../hooks';


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

const AgreementCreateRoute = ({
  handlers = {},
  history,
  location,
}) => {
  const { authority, referenceId } = queryString.parse(location?.search);

  const callout = useContext(CalloutContext);
  const stripes = useStripes();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const { basket = [] } = useBasket();

  const {
    handleBasketLinesAdded,
    isExternalEntitlementLoading,
    getAgreementLinesToAdd
  } = useAddFromBasket(basket);

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

  // Single function to handle "close to agreement" and "close to agreement list"
  const handleClose = (id) => {
    const pushUrl = id ? urls.agreementView(id) : urls.agreements();

    // if authority && referenceId exist we can assume the call came from eholdings and no other URL params are there
    // we can get rid of the whole location.search
    if (authority && referenceId) {
      history.push(pushUrl);
    } else {
      history.push(`${pushUrl}${location.search}`);
    }
  };

  const { mutateAsync: postAgreement } = useMutation(
    [AGREEMENTS_ENDPOINT, 'ui-agreements', 'AgreementCreateRoute', 'createAgreement'],
    (payload) => ky.post(AGREEMENTS_ENDPOINT, { json: payload }).json()
      .then(({ id, name, linkedLicenses }) => {
        // Invalidate any linked license's linkedAgreements calls
        if (linkedLicenses?.length) {
          linkedLicenses.forEach(linkLic => {
            // I'm still not 100% sure this is the "right" way to go about this.
            queryClient.invalidateQueries(['ERM', 'License', linkLic?.id, 'LinkedAgreements']); // This is a convention adopted in licenses
          });
        }
        /* Invalidate cached queries */
        queryClient.invalidateQueries(['ERM', 'Agreements']);

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.agreements.create.callout" values={{ name }} /> });
        handleClose(id);
      })
  );


  const handleSubmit = (agreement) => {
    const relationshipTypeValues = getRefdataValuesByDesc(refdata, RELATIONSHIP_TYPE);
    splitRelatedAgreements(agreement, relationshipTypeValues);

    postAgreement(agreement);
  };

  const fetchIsPending = () => {
    return isExternalEntitlementLoading;
  };

  const getInitialValues = () => {
    const periods = [{}];
    let items;

    // if authority && referenceId exist we can assume the call came from eholdings
    // add an item to agreement
    if (authority && referenceId) {
      items = [
        {
          'type': 'external',
          'authority': authority,
          'reference': referenceId,
        }
      ];
    }

    return {
      items,
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
        basket,
        contactRoleValues: getRefdataValuesByDesc(refdata, CONTACT_ROLE),
        documentCategories: getRefdataValuesByDesc(refdata, DOC_ATTACHMENT_TYPE),
        isPerpetualValues: getRefdataValuesByDesc(refdata, GLOBAL_YES_NO),
        licenseLinkStatusValues: getRefdataValuesByDesc(refdata, REMOTE_LICENSE_LINK_STATUS),
        orgRoleValues: getRefdataValuesByDesc(refdata, ORG_ROLE),
        renewalPriorityValues: getRefdataValuesByDesc(refdata, RENEWAL_PRIORITY),
        users: [],
      }}
      handlers={{
        ...handlers,
        onBasketLinesAdded: handleBasketLinesAdded,
        onClose: () => handleClose(), // Ensure passed onClose is always to agreement list
      }}
      initialValues={getInitialValues()}
      isLoading={fetchIsPending()}
      onSubmit={handleSubmit}
    />
  );
};

AgreementCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired
  }).isRequired,
};

export default AgreementCreateRoute;
