import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { isEmpty } from 'lodash';
import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect, useOkapiKy, useStripes } from '@folio/stripes/core';
import View from '../../components/views/AgreementLineForm';
import { AGREEMENT_LINES_ENDPOINT } from '../../constants/endpoints';
import { useSuppressFromDiscovery, useChunkedOrderLines } from '../../hooks';
import { urls } from '../../components/utilities';
import { endpoints } from '../../constants';

const { AGREEMENT_LINE_ENDPOINT } = endpoints;

const AgreementLineEditRoute = ({
  handlers,
  history,
  location,
  match: { params: { agreementId, lineId } },
  resources
}) => {
  const ky = useOkapiKy();
  const callout = useContext(CalloutContext);
  const stripes = useStripes();
  const queryClient = useQueryClient();
  const [isCreateAnotherChecked, setCreateAnotherChecked] = useState(false);
  const isSuppressFromDiscoveryEnabled = useSuppressFromDiscovery();

  const agreementLinePath = AGREEMENT_LINE_ENDPOINT(lineId);

  const { data: agreementLine = {}, isLoading: isLineLoading } = useQuery(
    ['ERM', 'AgreementLine', lineId, agreementLinePath],
    () => ky.get(agreementLinePath).json()
  );

  const poLineIdsArray = (agreementLine.poLines ?? []).map(poLine => poLine.poLineId).flat();
  const { orderLines, isLoading: areOrderLinesLoading } = useChunkedOrderLines(poLineIdsArray);

  const handleClose = () => {
    if (location.pathname.startsWith('/erm/agreements')) {
      history.push(`${urls.agreementLineView(agreementId, lineId)}${location.search}`);
    } else {
      history.push(`${urls.agreementLineNativeView(agreementId, lineId)}${location.search}`);
    }
  };

  const { mutateAsync: postAgreementLine } = useMutation(
    ['ERM', 'Agreement', agreementId, 'AgreementLines', 'POST', AGREEMENT_LINES_ENDPOINT],
    (payload) => ky.post(AGREEMENT_LINES_ENDPOINT, { json: { ...payload, owner: agreementId } }).json()
      .then(() => {
        /* Invalidate cached queries */
        queryClient.invalidateQueries(['ERM', 'Agreement', agreementId]);

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.line.update.callout" /> });
        history.push(`${urls.agreementLineCreate(agreementId)}${location.search}`);
      })
  );

  const { mutateAsync: putAgreementLine } = useMutation(
    ['ERM', 'AgreementLine', lineId, 'PUT', agreementLinePath],
    (payload) => ky.put(agreementLinePath, { json: payload }).json()
      .then(() => {
        /* Invalidate cached queries */
        queryClient.invalidateQueries(['ERM', 'Agreement', agreementId]);

        callout.sendCallout({ message: <FormattedMessage id="ui-agreements.line.update.callout" /> });
        if (!isCreateAnotherChecked) {
          handleClose();
        }
      })
  );

  const getCompositeLine = () => {
    const poLines = (agreementLine.poLines || [])
      .map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId))
      .filter(poLine => poLine);

    return {
      ...agreementLine,
      poLines,
    };
  };

  const getInitialValues = () => {
    return {
      ...agreementLine,
      linkedResource: agreementLine.type !== 'detached' ? agreementLine : undefined,
      coverage: agreementLine.customCoverage ? agreementLine.coverage : undefined,
    };
  };

  /* istanbul ignore next */
  const handleSubmit = (line) => {
    let payload; // payload to be PUT to the endpoint
    const { linkedResource, type, ...rest } = line;
    if (linkedResource?.type === 'packages') { // On submitting a package selected from eholdings plugin
      payload = {
        'type': 'external',
        'authority': 'ekb-package',
        'reference': linkedResource.id,
        ...rest,
        resource: null
      };
    } else if (linkedResource?.type === 'resources') { // On submitting a title selected from eholdings plugin
      payload = {
        'type': 'external',
        'authority': 'ekb-title',
        'reference': linkedResource.id,
        ...rest,
        resource: null
      };
    } else if (isEmpty(linkedResource)) { // On editing a detached line but not adding a resource
      payload = { 'type': 'detached', ...rest, resource: null };
    } else if (type === 'detached') { // on editing a detached line and adding a resource
      payload = { resource: linkedResource, ...rest, type: null };
    } else if (type === 'external') { // on editing an external line
      payload = { resource: null, ...rest, type: 'external' };
    } else { // on editing an internal line
      payload = { resource: linkedResource, ...rest, type };
    }

    if (isCreateAnotherChecked) {
      postAgreementLine(line);
    } else {
      putAgreementLine({
        id: lineId,
        ...payload
      });
    }
  };

  if (isLineLoading || areOrderLinesLoading) return <LoadingView dismissible onClose={handleClose} />;

  return (
    <View
      key={`agreement-line-edit-pane-${lineId}`}
      data={{
        basket: (resources?.basket ?? []),
        line: getCompositeLine(),
      }}
      handlers={{
        ...handlers,
        isSuppressFromDiscoveryEnabled,
        onClose: handleClose,
      }}
      initialValues={getInitialValues()}
      isCreateAnotherChecked={isCreateAnotherChecked}
      isEholdingsEnabled={stripes.hasPerm('module.eholdings.enabled')}
      isLoading={isLineLoading || areOrderLinesLoading}
      lineId={lineId}
      onSubmit={handleSubmit}
      toggleCreateAnother={setCreateAnotherChecked}
    />
  );
};

AgreementLineEditRoute.manifest = Object.freeze({
  basket: { initialValue: [] },
});

AgreementLineEditRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      agreementId: PropTypes.string.isRequired,
      lineId: PropTypes.string.isRequired,
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

export default stripesConnect(AgreementLineEditRoute);
