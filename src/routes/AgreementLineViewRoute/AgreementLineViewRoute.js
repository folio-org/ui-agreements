import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { FormattedMessage } from 'react-intl';

import { CalloutContext, useOkapiKy } from '@folio/stripes/core';

import View from '../../components/views/AgreementLine';
import { urls } from '../../components/utilities';

import { useAgreementsHelperApp, useChunkedOrderLines } from '../../hooks';
import { AGREEMENT_LINES_ENDPOINT, AGREEMENT_LINE_ENDPOINT } from '../../constants/endpoints';
import useSuppressFromDiscovery from '../../hooks/useSuppressFromDiscovery';

const AgreementLineViewRoute = ({
  handlers,
  history,
  location,
  match: { params: { agreementId, lineId } },
}) => {
  const callout = useContext(CalloutContext);
  const queryClient = useQueryClient();
  const isSuppressFromDiscoveryEnabled = useSuppressFromDiscovery();

  const ky = useOkapiKy();

  const agreementLinePath = AGREEMENT_LINE_ENDPOINT(lineId);

  const { data: agreementLine = {}, isLoading: isLineQueryLoading } = useQuery(
    [agreementLinePath, 'ui-agreements', 'AgreementLineViewRoute', 'getLine'],
    () => ky.get(agreementLinePath).json()
  );

  const { mutateAsync: deleteAgreementLine } = useMutation(
    [agreementLinePath, 'ui-agreements', 'AgreementLineViewRoute', 'deleteAgreementLine'],
    () => ky.put(agreementLinePath, {
      id: agreementId,
      items: [{ id: lineId, _delete: true }]
    }).then(() => {
      queryClient.invalidateQueries(AGREEMENT_LINES_ENDPOINT);
      history.push(`${urls.agreementView(agreementId)}${location.search}`);
      callout.sendCallout({ message: <FormattedMessage id="ui-agreements.line.delete.callout" /> });
    }).catch(error => {
      callout.sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.line.deleteFailed.callout" values={{ message: error.message }} /> });
    })
  );

  const {
    handleToggleTags,
    HelperComponent,
    TagButton,
  } = useAgreementsHelperApp();

  const poLineIdsArray = (agreementLine.poLines ?? []).map(poLine => poLine.poLineId).flat();
  const { orderLines, isLoading: areOrderLinesLoading } = useChunkedOrderLines(poLineIdsArray);

  const getCompositeLine = () => {
    const poLines = (agreementLine.poLines || [])
      .map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId))
      .filter(poLine => poLine);

    return {
      ...agreementLine,
      poLines,
    };
  };

  const handleClose = () => {
    history.push(`${urls.agreementView(agreementId)}${location.search}`);
  };


  const handleEdit = () => {
    history.push(`${urls.agreementLineEdit(agreementId, lineId)}${location.search}`);
  };

  const isLineLoading = () => {
    return (
      lineId !== agreementLine?.id && isLineQueryLoading
    );
  };

  return (
    <View
      key={`agreement-line-view-pane-${lineId}`}
      components={{
        TagButton,
        HelperComponent
      }}
      data={{
        line: getCompositeLine(),
        tagsLink: agreementLinePath
      }}
      handlers={{
        ...handlers,
        isSuppressFromDiscoveryEnabled,
        onClose: handleClose,
        onDelete: deleteAgreementLine,
        onEdit: handleEdit,
        onToggleTags: handleToggleTags
      }}
      isLoading={isLineLoading() || areOrderLinesLoading}
    />
  );
};

AgreementLineViewRoute.propTypes = {
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
      lineId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
};

export default AgreementLineViewRoute;
