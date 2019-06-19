import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import View from '../components/views/Title';
import { urls } from '../components/utilities';

class TitleViewRoute extends React.Component {
  static manifest = Object.freeze({
    eresource: {
      type: 'okapi',
      path: 'erm/resource/:{id}',
    },
    entitlements: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlements',
      limitParam: 'perPage',
      perRequest: 100,
    },
    entitlementOptions: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlementOptions',
    },
    query: {},
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }).isRequired,
    resources: PropTypes.shape({
      eresource: PropTypes.object,
      entitlementOptions: PropTypes.object,
    }).isRequired
  };

  handleClose = () => {
    this.props.history.push(`${urls.eresources}${this.props.location.search}`);
  }

  render() {
    const { resources } = this.props;

    return (
      <View
        data={{
          eresource: get(resources, 'eresource.records[0]', {}),
          entitlements: get(resources, 'entitlements.isPending') ? undefined : get(resources, 'entitlements.records', []),
          entitlementOptions: get(resources, 'entitlementOptions.isPending') ? undefined : get(resources, 'entitlementOptions.records', [])
        }}
        handlers={{
          onClose: this.handleClose,
        }}
        isLoading={get(resources, 'eresource.isPending') || get(resources, 'entitlements.isPending')}
      />
    );
  }
}

export default stripesConnect(TitleViewRoute);
