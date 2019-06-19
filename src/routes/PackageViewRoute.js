import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import View from '../components/views/Package';
import { urls } from '../components/utilities';

class PackageViewRoute extends React.Component {
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
    packageContents: {
      type: 'okapi',
      path: 'erm/resource',
      records: 'results',
      limitParam: 'perPage',
      perRequest: 100,
      recordsRequired: '1000',
      params: {
        filters: 'pkg.id==:{id}',
        sort: 'pti.titleInstance.name;asc',
        stats: 'true',
      },
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
      packageContents: PropTypes.object,
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
          entitlements: get(resources, 'entitlements.records', []),
          packageContents: get(resources, 'packageContents.isPending') ? undefined : get(resources, 'packageContents.records', [])
        }}
        handlers={{
          onClose: this.handleClose,
        }}
        isLoading={get(resources, 'eresource.isPending') || get(resources, 'entitlements.isPending')}
      />
    );
  }
}

export default stripesConnect(PackageViewRoute);
