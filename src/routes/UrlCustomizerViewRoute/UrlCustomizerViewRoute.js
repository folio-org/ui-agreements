import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useCallout, useOkapiKy } from '@folio/stripes/core';

import View from '../../components/views/UrlCustomizer';
import { urls } from '../../components/utilities';

import { STRING_TEMPLATE_ENDPOINT } from '../../constants';

const UrlCustomizerViewRoute = ({
  handlers,
  history,
  location,
  match: { params: { platformId, templateId } },
}) => {
  const callout = useCallout();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const handleClose = () => {
    history.push(`${urls.platformView(platformId)}${location.search}`);
  };

  const urlCustomizerPath = STRING_TEMPLATE_ENDPOINT(templateId);

  const { data: urlCustomizer, isLoading } = useQuery(
    ['ERM', 'URLCustomizer', templateId, 'GET', urlCustomizerPath],
    () => ky.get(urlCustomizerPath).json()
  );

  const { mutateAsync: deleteUrlCustomizer } = useMutation(
    // As opposed to ['ERM', 'AgreementLine', lineId, 'DELETE', agreementLinePath] if we did this via a DELETE call to entitlements endpoint
    ['ERM', 'URLCustomizer', templateId, 'DELETE', urlCustomizerPath],
    () => ky.delete(urlCustomizerPath).then(() => {
      history.push(`${urls.platformView(platformId)}${location.search}`);

      queryClient.invalidateQueries('ERM', 'URLCustomizer');
      callout.sendCallout({ message: <FormattedMessage id="ui-agreements.platform.urlCustomization.delete.callout" /> });
    }).catch(error => {
      callout.sendCallout({ type: 'error', timeout: 0, message: <FormattedMessage id="ui-agreements.platform.urlCustomization..deleteFailed.callout" values={{ message: error.message }} /> });
    })
  );

  const handleEdit = () => {
    history.push(`${urls.urlCustomizerEdit(platformId, templateId)}${location.search}`);
  };

  return (
    <View
      data={{
        urlCustomization: urlCustomizer,
      }}
      handlers={{
        ...handlers,
        onClose: handleClose,
        onDelete: deleteUrlCustomizer,
        onEdit: handleEdit,
      }}
      isLoading={isLoading}
    />
  );
};

UrlCustomizerViewRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      templateId: PropTypes.string.isRequired,
      platformId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
};

export default UrlCustomizerViewRoute;
