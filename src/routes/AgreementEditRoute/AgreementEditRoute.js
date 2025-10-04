import React, { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { useMutation, useQueryClient, useQuery } from 'react-query';

import { cloneDeep } from 'lodash';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, useOkapiKy, useStripes } from '@folio/stripes/core';
import {
  APPLY_POLICIES,
  getRefdataValuesByDesc,
  READ,
  UPDATE,
  useAgreement,
  useChunkedUsers,
  useClaim,
  useGetAccess,
  usePolicies
} from '@folio/stripes-erm-components';

import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import { joinRelatedAgreements, splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import {
  AGREEMENT_ENDPOINT,
  AGREEMENT_LINES_ENDPOINT,
  AGREEMENTS_ENDPOINT
} from '../../constants';
import { useAgreementsRefdata, useBasket } from '../../hooks';

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
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const callout = useContext(CalloutContext);
  const stripes = useStripes();

  const { basket = [] } = useBasket();

  const accessControlData = useGetAccess({
    resourceEndpoint: AGREEMENTS_ENDPOINT,
    resourceId: agreementId,
    restrictions: [READ, UPDATE, APPLY_POLICIES],
    queryNamespaceGenerator: (_restriction, canDo) => ['ERM', 'Agreement', agreementId, canDo]
  });

  const {
    canRead,
    canReadLoading,
    canEdit,
    canEditLoading,
  } = accessControlData;

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

  const { agreement, isAgreementLoading = true } = useAgreement({
    agreementId,
    queryOptions: {
      enabled: !canReadLoading && !!canRead
    }
  });

  /* START agreementLineCount
    the following is necessary to provide information of number of agreement lines in the edit form,
    could be removed if we change the agreement API to include that information
  */

  const agreementLineQueryParams = useMemo(() => (
    generateKiwtQueryParams({ filters: [{ path: 'owner', value: agreementId }], perPage: 1 }, {})), [agreementId]);

  const {
    data: { totalRecords: agreementLineCount = 0 } = {},
  } = useQuery(
    ['ERM', 'Agreement', agreementId, 'AgreementLines', AGREEMENT_LINES_ENDPOINT, 'AgreementEditRoute'],
    () => {
      const params = [...agreementLineQueryParams];
      return ky.get(`${AGREEMENT_LINES_ENDPOINT}?${params?.join('&')}`).json();
    }
  );
  /* END agreementLineCount */

  // Users
  const { users } = useChunkedUsers(agreement?.contacts?.filter(c => c.user)?.map(c => c.user) ?? []);

  const { claim } = useClaim({ resourceEndpoint: AGREEMENTS_ENDPOINT });

  const { mutateAsync: putAgreement } = useMutation(
    [AGREEMENT_ENDPOINT(agreementId), 'ui-agreements', 'AgreementEditRoute', 'editAgreement'],
    (payload) => ky.put(AGREEMENT_ENDPOINT(agreementId), { json: payload }).json()
      .then(async (resp) => {
        const { name } = resp;
        // Grab id from response and submit a claim ... CRUCIALLY await the response.
        // TODO we need to think about failure cases here.
        return claim({ resourceId: agreementId, payload: { claims: payload.claimPolicies ?? [] } })
          .then(() => {
            callout.sendCallout({
              type: 'success',
              message: <FormattedMessage id="ui-agreements.agreements.claimPolicies.update.callout" values={{ name }} />,
            });
            return resp; // Allow it to continue downstream
          })
          .catch((claimError) => {
            callout.sendCallout({
              type: 'error',
              message: <FormattedMessage id="ui-agreements.agreements.claimPolicies.update.error.callout" values={{ name, error: claimError.message }} />,
              timeout: 0,
            });
            return resp;
          });
      })
      .then(async (response) => {
        const { name, linkedLicenses } = response;
        // Invalidate any linked license's linkedAgreements calls
        if (linkedLicenses?.length) {
          await Promise.all(linkedLicenses.map(linkLic => {
            // I'm still not 100% sure this is the "right" way to go about this.
            return queryClient.invalidateQueries(['ERM', 'License', linkLic?.id, 'LinkedAgreements']); // This is a convention adopted in licenses
          }));
        }

        /* Invalidate cached queries */
        await queryClient.invalidateQueries(['ERM', 'Agreements']);
        await queryClient.invalidateQueries(['ERM', 'Agreement', agreementId]);

        callout.sendCallout({
          type: 'success',
          message: <FormattedMessage id="ui-agreements.agreements.update.callout" values={{ name }} />
        });

        history.push(`${urls.agreementView(agreementId)}${location.search}`);

        return response;
      })
      .catch((agreementError) => {
        callout.sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-agreements.agreements.update.error.callout" values={{ name: payload?.name ?? '', error: agreementError.message }} />,
          timeout: 0,
        });
        throw agreementError;
      })
  );

  const { policies } = usePolicies({
    resourceEndpoint: AGREEMENTS_ENDPOINT,
    resourceId: agreementId,
    queryNamespaceGenerator: () => ['ERM', 'Agreement', agreementId, 'policies'],
  });

  const getInitialValues = useCallback(() => {
    let initialValues = {};

    if (agreement?.id === agreementId) { // Not sure what this protects against right now
      initialValues = cloneDeep(agreement);
    }

    const {
      agreementStatus = {},
      contacts = [],
      isPerpetual = {},
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
    initialValues.orgs = orgs.map(o => ({ ...o, role: o.role?.value }));
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
    initialValues.claimPolicies = policies;

    joinRelatedAgreements(initialValues);

    return initialValues;
  }, [agreement, agreementId, policies]);

  const handleClose = () => {
    history.push(`${urls.agreementView(agreementId)}${location.search}`);
  };

  const handleSubmit = async (values) => {
    const relationshipTypeValues = getRefdataValuesByDesc(refdata, RELATIONSHIP_TYPE);
    splitRelatedAgreements(values, relationshipTypeValues);

    await putAgreement(values);
  };

  const fetchIsPending = () => {
    return isAgreementLoading;
  };

  if (!stripes.hasPerm('ui-agreements.agreements.edit')) return <NoPermissions />;
  if (fetchIsPending()) return <LoadingView dismissible onClose={handleClose} />;

  return (
    <View
      accessControlData={{
        isAccessControlLoading: canEditLoading || canReadLoading, // Special prop used by AgreementForm to avoid edit/create distinctions
        isAccessDenied: !canRead || !canEdit, // Special prop used by AgreementForm to avoid edit/create distinctions
        ...accessControlData
      }}
      data={{
        agreementLineCount,
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
        users,
      }}
      handlers={{
        ...handlers,
        onClose: handleClose,
      }}
      initialValues={getInitialValues()}
      isLoading={fetchIsPending()}
      onSubmit={handleSubmit}
    />
  );
};

export default AgreementEditRoute;

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
};
