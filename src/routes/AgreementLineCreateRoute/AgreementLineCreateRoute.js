import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQueryClient } from 'react-query';

import compose from 'compose-function';
import { isEmpty } from 'lodash';

import { CalloutContext, stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import { isPackage } from '@folio/stripes-erm-components';

import View from '../../components/views/AgreementLineForm';
import { urls, withSuppressFromDiscovery } from '../../components/utilities';
import { AGREEMENT_LINES_ENDPOINT, AGREEMENT_ENDPOINT } from '../../constants/endpoints';

const AgreementLineCreateRoute = ({
  handlers,
  history,
  isSuppressFromDiscoveryEnabled,
  location,
  match: { params: { agreementId } },
  resources
}) => {
  const callout = useContext(CalloutContext);
  const ky = useOkapiKy();
  const stripes = useStripes();
  const queryClient = useQueryClient();

  const handleClose = () => {
    history.push(`${urls.agreementView(agreementId)}${location.search}`);
  };

  const { mutateAsync: postAgreementLine } = useMutation(
    [AGREEMENT_LINES_ENDPOINT, 'ui-agreements', 'AgreementLineCreateRoute', 'createAgreementLine'],
    (payload) => ky.post(AGREEMENT_LINES_ENDPOINT, { json: { ...payload, owner: agreementId } }).json()
      .then(({ id }) => {
        /* Invalidate cached queries */
        queryClient.invalidateQueries(AGREEMENT_ENDPOINT(agreementId));

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.line.create.callout" /> });
        history.push(`${urls.agreementLineView(agreementId, id)}${location.search}`);
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
      data={{
        basket: (resources?.basket ?? []),
      }}
      handlers={{
        ...handlers,
        isSuppressFromDiscoveryEnabled,
        onClose: handleClose,
      }}
      isEholdingsEnabled={stripes.hasPerm('module.eholdings.enabled')}
      onSubmit={handleSubmit}
    />
  );
};

AgreementLineCreateRoute.manifest = Object.freeze({
  basket: { initialValue: [] },
});

AgreementLineCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      agreementId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
  resources: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  stripes: PropTypes.shape({
    hasInterface: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default compose(
  stripesConnect,
  withSuppressFromDiscovery,
)(AgreementLineCreateRoute);
