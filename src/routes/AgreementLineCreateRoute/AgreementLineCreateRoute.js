import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQueryClient } from 'react-query';

import { isEmpty } from 'lodash';

import { CalloutContext, useOkapiKy, useStripes } from '@folio/stripes/core';
import { isPackage, getRefdataValuesByDesc } from '@folio/stripes-erm-components';

import View from '../../components/views/AgreementLineForm';
import { urls } from '../../components/utilities';

import { AGREEMENT_LINES_ENDPOINT } from '../../constants';
import {
  useBasket,
  useSuppressFromDiscovery,
  useAgreementsRefdata,
} from '../../hooks';

const [DOC_ATTACHMENT_TYPE] = ['DocumentAttachment.AtType'];

const AgreementLineCreateRoute = ({
  handlers,
  history,
  location,
  match: { params: { agreementId } },
}) => {
  const callout = useContext(CalloutContext);
  const ky = useOkapiKy();
  const stripes = useStripes();
  const queryClient = useQueryClient();

  const { basket = [] } = useBasket();
  const refdata = useAgreementsRefdata({
    desc: [DOC_ATTACHMENT_TYPE],
  });
  /*
 * This state tracks a checkbox on the form marked "Create another",
 * which allows the user to redirect back to this form on submit
 */
  const [createAnother, setCreateAnother] = useState(false);
  const isSuppressFromDiscoveryEnabled = useSuppressFromDiscovery();

  const handleClose = () => {
    history.push(`${urls.agreementView(agreementId)}${location.search}`);
  };

  const { mutateAsync: postAgreementLine } = useMutation(
    ['ERM', 'Agreement', agreementId, 'AgreementLines', 'POST', AGREEMENT_LINES_ENDPOINT],
    (payload) => ky.post(AGREEMENT_LINES_ENDPOINT, { json: { ...payload, owner: agreementId } }).json()
      .then(({ id }) => {
        /* Invalidate cached queries */
        queryClient.invalidateQueries(['ERM', 'Agreement', agreementId]);

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.line.create.callout" /> });
        if (createAnother) {
          // Very briefly redirect to view so form rerenders
          history.push(`${urls.agreementLineView(agreementId, id)}${location.search}`);
          // Then, set a timeout with a minimal delay to push back to the create page
          setTimeout(() => {
            history.push(`${urls.agreementLineCreate(agreementId)}${location.search}`);
          }, 1);
        } else {
          history.push(`${urls.agreementLineView(agreementId, id)}${location.search}`);
        }
      })
  );

  const handleSubmit = (line) => {
    const {
      linkedResource: resource,
      coverage,
      ...rest
    } = line;

    let items;

    if (resource?.type === 'packages' || resource?.type === 'resources') { // external line
      items = {
        'type': 'external',
        'authority': resource?.type === 'packages' ? 'ekb-package' : 'ekb-title',
        'reference': resource.id,
        ...rest
      };
    } else if (isEmpty(resource)) { // detached line
      items = {
        'type': 'detached',
        ...rest,
        resource: null,
        coverage: []
      };
    } else { // internal line
      items = {
        resource,
        coverage: isPackage(resource) ? [] : coverage, // pass empty coverage for internal package
        ...rest
      };
    }
    postAgreementLine(items);
  };


  return (
    <View
      key="agreement-line-create-form"
      createAnother={createAnother}
      data={{
        documentCategories: getRefdataValuesByDesc(refdata, DOC_ATTACHMENT_TYPE),
        basket,
      }}
      handlers={{
        ...handlers,
        isSuppressFromDiscoveryEnabled,
        onClose: handleClose,
      }}
      isEholdingsEnabled={stripes.hasPerm('module.eholdings.enabled')}
      onSubmit={handleSubmit}
      toggleCreateAnother={() => setCreateAnother(!createAnother)}
    />
  );
};

AgreementLineCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      agreementId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
};

export default AgreementLineCreateRoute;
