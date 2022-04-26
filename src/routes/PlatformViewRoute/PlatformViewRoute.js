import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useMutation, useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import View from '../../components/views/Platform';
import { urls } from '../../components/utilities';

const PlatformViewRoute = ({
  history,
  location,
  match: { params: { id: platformId } = {} } = {},
}) => {
  const ky = useOkapiKy();

  const platformPath = `erm/platforms/${platformId}`;
  const { data: platform, isLoading: isPlatformLoading } = useQuery(
    [platformPath, 'ui-agreements', 'PlatformViewRoute', 'getPlatform'],
    () => ky.get(platformPath).json()
  );

  const stringTemplatesPath = `erm/sts/template/${platformId}`;
  const { data: stringTemplates } = useQuery(
    [stringTemplatesPath, 'ui-agreements', 'PlatformViewRoute', 'getStringTemplates'],
    () => ky.get(stringTemplatesPath).json()
  );

  const proxyServersPath = 'erm/sts';
  const { data: proxyServers } = useQuery(
    [proxyServersPath, 'ui-agreements', 'PlatformViewRoute', 'getProxyServers'],
    () => ky.get(`${proxyServersPath}?filters=context.value=urlproxier`).json()
  );

  const { mutateAsync: putProxyServer } = useMutation(
    [proxyServersPath, 'ui-agreements', 'PlatformViewRoute', 'putProxyServer'],
    (payload) => ky.put(proxyServersPath, { json: payload })
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


/* class PlatformViewRoute extends React.Component {
  static manifest = Object.freeze({
    platform: {
      type: 'okapi',
      path: 'erm/platforms/:{id}',
    },
    stringTemplates: {
      type: 'okapi',
      path: 'erm/sts/template/:{id}',
      clientGeneratePk: false,
      throwErrors: false
    },
    proxyServers: {
      type: 'okapi',
      path: 'erm/sts',
      params: {
        filters: 'context.value=urlproxier',
      },
      throwErrors: false
    },
  });

  static propTypes = {
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
      platform: PropTypes.object,
      proxyServers: PropTypes.arrayOf(PropTypes.object),
      stringTemplates: PropTypes.object
    }).isRequired,
  };

  handleClose = () => {
    this.props.history.push(`${urls.platforms()}${this.props.location.search}`);
  }

  handleEdit = () => {
    const { history, location, match } = this.props;
    history.push(`${urls.platformEdit(match.params.id)}${location.search}`);
  }

  handleEResourceClick = (id) => {
    this.props.history.push(`${urls.eresourceView(id)}${this.props.location.search}`);
  }

  handleViewUrlCustomizer = (templateId) => {
    const { history, location, match } = this.props;
    history.push(`${urls.urlCustomizerView(match.params.id, templateId)}${location.search}`);
  }

  handleClickProxyServerAction = (proxyServer, platformId, hasPlatformId) => {
    const mutator = this.props.mutator.proxyServers;
    const { idScopes = [] } = proxyServer;

    const idScopeValues = hasPlatformId ?
      idScopes.filter(id => id !== '' && id !== platformId) // empy string condition needs to be taken off once the bug in webtoolkit is fixed
      :
      [...idScopes.filter(id => id !== ''), platformId]; // empy string condition needs to be taken off once the bug in webtoolkit is fixed

    const proxyServerPayload = {
      ...proxyServer,
      ...{ idScopes: isEmpty(idScopeValues) ? [''] : idScopeValues }, // empy string condition needs to be taken off once the bug in webtoolkit is fixed
      'context': 'urlProxier'
    };

    return mutator.PUT(proxyServerPayload);
  }

  isLoading = () => {
    const { match, resources } = this.props;
    return (
      match.params.id !== resources?.platform?.records?.[0]?.id &&
      (resources?.platform?.isPending ?? true)
    );
  }

  getRecords = (resource) => {
    return get(this.props.resources, `${resource}.isPending`, true)
      ?
      undefined
      :
      get(this.props.resources, `${resource}.records`);
  }

  render() {
    const {
      resources,
    } = this.props;

    return (
      <View
        data={{
          platform: resources?.platform?.records?.[0] ?? {},
          stringTemplates: resources?.stringTemplates?.records[0] ?? [],
          proxyServers: resources?.proxyServers?.records ?? [],
        }}
        handlers={{
          onClose: this.handleClose,
          onEdit: this.handleEdit,
          onViewUrlCustomizer: this.handleViewUrlCustomizer,
          onClickProxyServerAction: this.handleClickProxyServerAction
        }}
        isLoading={this.isLoading()}
      />
    );
  }
}

export default stripesConnect(PlatformViewRoute);
 */