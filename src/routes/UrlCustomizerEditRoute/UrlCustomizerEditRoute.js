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
import { STRING_TEMPLATE_ENDPOINT } from '../../constants/endpoints';

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
  mutator: PropTypes.shape({
    urlCustomization: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
  }).isRequired,
  resources: PropTypes.shape({
    platform: PropTypes.object,
    urlCustomization: PropTypes.object
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};


/*

class UrlCustomizerEditRoute extends React.Component {
  static manifest = Object.freeze({
    urlCustomization: {
      type: 'okapi',
      path: 'erm/sts/:{templateId}',
      shouldRefresh: () => false,
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
        platformId: PropTypes.string,
        templateId: PropTypes.string,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      urlCustomization: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      platform: PropTypes.object,
      urlCustomization: PropTypes.object
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-agreements.platforms.edit'),
    };
  }

  getInitialValues = () => {
    const { resources } = this.props;
    const urlCustomization = resources?.urlCustomization?.records?.[0] ?? {};
    const initialValues = cloneDeep(urlCustomization);
    return initialValues;
  }

  handleClose = () => {
    const { location, match, history } = this.props;
    history.push(`${urls.urlCustomizerView(match.params.platformId, match.params.templateId)}${location.search}`);
  }

  handleSubmit = (urlCustomization) => {
    const {
      history,
      location,
      mutator,
      match: { params: { platformId } },
    } = this.props;

    return mutator.urlCustomization
      .PUT(urlCustomization)
      .then(({ id }) => {
        this.context.sendCallout({ message: <FormattedMessage id="ui-agreements.platform.urlCustomization.update.callout" /> });
        history.push(`${urls.urlCustomizerView(platformId, id)}${location.search}`);
      });
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'urlCustomization')
      .some(r => r.isPending);
  }

  render() {
    if (!this.state.hasPerms) return <NoPermissions />;
    if (this.fetchIsPending()) return <LoadingView dismissible onClose={this.handleClose} />;

    return (
      <View
        handlers={{
          onClose: this.handleClose,
        }}
        initialValues={this.getInitialValues()}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(UrlCustomizerEditRoute);

*/