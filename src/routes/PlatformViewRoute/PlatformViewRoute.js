import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useMutation, useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import View from '../../components/views/Platform';
import { urls } from '../../components/utilities';
import {
  PLATFORM_ENDPOINT,
  STRING_TEMPLATES_ENDPOINT,
  STRING_TEMPLATES_PLATFORM_ENDPOINT
} from '../../constants/endpoints';

const PlatformViewRoute = ({
  history,
  location,
  match: { params: { id: platformId } = {} } = {},
}) => {
  const ky = useOkapiKy();

  const { data: platform, isLoading: isPlatformLoading } = useQuery(
    [PLATFORM_ENDPOINT(platformId), 'getPlatform'],
    () => ky.get(PLATFORM_ENDPOINT(platformId)).json()
  );

  const stringTemplatesPath = STRING_TEMPLATES_PLATFORM_ENDPOINT(platformId);
  const { data: stringTemplates } = useQuery(
    [stringTemplatesPath, 'ui-agreements', 'PlatformViewRoute', 'getStringTemplates'],
    () => ky.get(stringTemplatesPath).json()
  );

  const { data: proxyServers } = useQuery(
    [STRING_TEMPLATES_ENDPOINT, 'ui-agreements', 'PlatformViewRoute', 'getProxyServers'],
    () => ky.get(`${STRING_TEMPLATES_ENDPOINT}?filters=context.value=urlproxier`).json()
  );

  const { mutateAsync: putProxyServer } = useMutation(
    [STRING_TEMPLATES_ENDPOINT, 'ui-agreements', 'PlatformViewRoute', 'putProxyServer'],
    (payload) => ky.put(STRING_TEMPLATES_ENDPOINT, { json: payload })
  );


  const handleClose = () => {
    history.push(`${urls.platforms()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.platformEdit(platformId)}${location.search}`);
  };

  const handleViewUrlCustomizer = (templateId) => {
    history.push(`${urls.urlCustomizerView(platformId, templateId)}${location.search}`);
  };

  const handleClickProxyServerAction = (proxyServer, pId, hasPlatformId) => {
    const { idScopes = [] } = proxyServer;

    const idScopeValues = hasPlatformId ?
      idScopes.filter(id => id !== '' && id !== pId) // empy string condition needs to be taken off once the bug in webtoolkit is fixed
      :
      [...idScopes.filter(id => id !== ''), pId]; // empy string condition needs to be taken off once the bug in webtoolkit is fixed

    const proxyServerPayload = {
      ...proxyServer,
      ...{ idScopes: isEmpty(idScopeValues) ? [''] : idScopeValues }, // empy string condition needs to be taken off once the bug in webtoolkit is fixed
      'context': 'urlProxier'
    };

    return putProxyServer(proxyServerPayload);
  };

  const isLoading = () => {
    return (
      platformId !== platform?.id &&
      isPlatformLoading
    );
  };

  return (
    <View
      data={{
        platform,
        stringTemplates,
        proxyServers,
      }}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
        onViewUrlCustomizer: handleViewUrlCustomizer,
        onClickProxyServerAction: handleClickProxyServerAction
      }}
      isLoading={isLoading()}
    />
  );
};

PlatformViewRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
  mutator: PropTypes.shape({
    proxyServers: PropTypes.shape({
      PUT: PropTypes.func.isRequired
    })
  }),
  resources: PropTypes.shape({
    proxyServers: PropTypes.arrayOf(PropTypes.object),
    stringTemplates: PropTypes.object
  }).isRequired,
};

export default PlatformViewRoute;
