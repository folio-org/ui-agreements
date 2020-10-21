import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';

import View from '../components/views/Platform';
import { urls, withSuppressFromDiscovery } from '../components/utilities';

const RECORDS_PER_REQUEST = 100;

class PlatformViewRoute extends React.Component {
  static manifest = Object.freeze({
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
    },
    query: {},
  });

  static propTypes = {
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
        id: PropTypes.string.isRequired,
      }).isRequired
    }).isRequired,
    mutator: PropTypes.shape({
      entitlementsCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      packageContentsCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      packageContentsFilter: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      packageContentsOffset: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      entitlementsCount: PropTypes.number,
      eresource: PropTypes.object,
      packageContents: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      packageContentsFilter: PropTypes.string,
      packageContentsCount: PropTypes.number,
      query: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    tagsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    handlers: {},
  }

  componentDidUpdate() {
    const { mutator, resources } = this.props;
    const totalEntitlements = get(resources, 'entitlements.other.totalRecords', RECORDS_PER_REQUEST);
    const { entitlementsCount } = resources;

    if (totalEntitlements > entitlementsCount) {
      mutator.entitlementsCount.replace(totalEntitlements);
    }
  }

  handleClose = () => {
    this.props.history.push(`${urls.eresources()}${this.props.location.search}`);
  }

  handleEdit = () => {
    const { history, location, match } = this.props;
    history.push(`${urls.platformEdit(match.params.id)}${location.search}`);
  }

  handleEResourceClick = (id) => {
    this.props.history.push(`${urls.eresourceView(id)}${this.props.location.search}`);
  }

  isLoading = () => {
    const { match, resources } = this.props;
    return (
      match.params.id !== get(resources, 'agreement.records[0].id') &&
      get(resources, 'agreement.isPending', true)
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
      handlers,
      isSuppressFromDiscoveryEnabled,
      resources,
      tagsEnabled,
    } = this.props;

    const agreement = get(resources, 'agreement.records[0]', {
      contacts: [],
      orgs: [],
    });

    return (
      <View
        key={get(resources, 'eresource.loadedAt', 'loading')}
        data={{
          agreement
        }}
        handlers={{
          ...handlers,
          isSuppressFromDiscoveryEnabled,
          onClose: this.handleClose,
          onEdit: this.handleEdit,
          onEResourceClick: this.handleEResourceClick,
        }}
        isLoading={this.isLoading()}
      />
    );
  }
}

export default compose(
  stripesConnect,
  withSuppressFromDiscovery,
  withTags,
)(PlatformViewRoute);
