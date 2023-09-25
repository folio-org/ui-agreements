import React from 'react';
import PropTypes from 'prop-types';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import View from '../../components/views/PlatformForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';

import { PLATFORM_ENDPOINT } from '../../constants';

const PlatformEditRoute = ({
  history,
  location,
  match: { params: { id: platformId } },
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const { data: platform, isLoading: isPlatformLoading } = useQuery(
    [PLATFORM_ENDPOINT(platformId), 'getPlatform'],
    () => ky.get(PLATFORM_ENDPOINT(platformId)).json()
  );

  const { mutateAsync: putPlatform } = useMutation(
    [PLATFORM_ENDPOINT(platformId), 'putPlatform'],
    (payload) => ky.put(PLATFORM_ENDPOINT(platformId), { json: payload }).json()
      .then(({ id }) => {
        queryClient.invalidateQueries(PLATFORM_ENDPOINT(platformId));
        history.push(`${urls.platformView(id)}${location.search}`);
      })
  );

  const handleClose = () => {
    history.push(`${urls.platformView(platformId)}${location.search}`);
  };

  const handleSubmit = (values) => {
    return putPlatform(values);
  };

  if (!stripes.hasPerm('ui-agreements.platforms.edit')) return <NoPermissions />;
  if (isPlatformLoading) return <LoadingView dismissible onClose={handleClose} />;
  return (
    <View
      handlers={{
        onClose: handleClose,
      }}
      initialValues={platform}
      onSubmit={handleSubmit}
    />
  );
};

export default PlatformEditRoute;

PlatformEditRoute.propTypes = {
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
