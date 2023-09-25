import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { cloneDeep } from 'lodash';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useCallout, useOkapiKy, useStripes } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import View from '../../components/views/UrlCustomizerForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import { STRING_TEMPLATE_ENDPOINT } from '../../constants';

const UrlCustomizerEditRoute = ({
  history,
  location,
  match: { params: { platformId, templateId } }
}) => {
  const callout = useCallout();
  const stripes = useStripes();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const endpoint = STRING_TEMPLATE_ENDPOINT(templateId);

  const { data: urlCustomizer, isLoading } = useQuery(
    ['ERM', 'URLCustomizer', templateId, 'GET', endpoint],
    () => ky.get(endpoint).json()
  );

  const { mutateAsync: putUrlCustomizer } = useMutation(
    ['ERM', 'URLCustomizer', templateId, 'PUT', endpoint],
    (urlCustomization) => ky.put(
      endpoint,
      { json: urlCustomization }
    ).json().then(({ id }) => {
      callout.sendCallout({ message: <FormattedMessage id="ui-agreements.platform.urlCustomization.update.callout" /> });
      history.push(`${urls.urlCustomizerView(platformId, id)}${location.search}`);

      queryClient.invalidateQueries('ERM', 'URLCustomizer', templateId);
    })
  );

  const handleClose = () => {
    history.push(`${urls.urlCustomizerView(platformId, templateId)}${location.search}`);
  };

  if (!stripes.hasPerm('ui-agreements.platforms.edit')) return <NoPermissions />;
  if (isLoading) return <LoadingView dismissible onClose={handleClose} />;

  return (
    <View
      handlers={{
        onClose: handleClose,
      }}
      initialValues={cloneDeep(urlCustomizer)}
      onSubmit={putUrlCustomizer}
    />
  );
};

export default UrlCustomizerEditRoute;

UrlCustomizerEditRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      platformId: PropTypes.string,
      templateId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
