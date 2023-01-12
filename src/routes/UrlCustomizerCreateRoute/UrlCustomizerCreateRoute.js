import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQueryClient } from 'react-query';

import { useCallout, useOkapiKy } from '@folio/stripes/core';

import View from '../../components/views/UrlCustomizerForm';
import { urls } from '../../components/utilities';
import { STRING_TEMPLATES_ENDPOINT } from '../../constants/endpoints';

const UrlCustomizerCreateRoute = ({
  handlers,
  history,
  location,
  match: { params: { platformId } }
}) => {
  const callout = useCallout();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const handleClose = () => {
    history.push(`${urls.platformView(platformId)}${location.search}`);
  };

  const { mutateAsync: postUrlCustomizer } = useMutation(
    ['ERM', 'URLCustomizer', 'POST', platformId, STRING_TEMPLATES_ENDPOINT],
    (urlCustomization) => ky.post(
      STRING_TEMPLATES_ENDPOINT,
      { json: {
        ...urlCustomization,
        'idScopes': [platformId],
        'context': 'urlCustomiser'
      } }
    ).json().then(({ id }) => {
      callout.sendCallout({ message: <FormattedMessage id="ui-agreements.platform.urlCustomization.create.callout" /> });
      history.push(`${urls.urlCustomizerView(platformId, id)}${location.search}`);

      queryClient.invalidateQueries('ERM', 'URLCustomizer');
    })
  );

  return (
    <View
      handlers={{
        ...handlers,
        onClose: handleClose,
      }}
      onSubmit={postUrlCustomizer}
    />
  );
};

UrlCustomizerCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      platformId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
};

export default UrlCustomizerCreateRoute;
