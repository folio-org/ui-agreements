import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import isPackage from '../../util/isPackage';

export default class ResourceKB extends React.Component {
  static propTypes = {
    resource: PropTypes.shape({
      class: PropTypes.string,
      _object: PropTypes.shape({
        pkg: PropTypes.shape({
          remoteKb: PropTypes.shape({
            name: PropTypes.string,
          })
        }),
        remoteKb: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    })
  }

  render() {
    const { resource } = this.props;
    if (!resource) return '-';

    if (isPackage(resource)) {
      return get(resource, ['_object', 'remoteKb', 'name'], '-');
    }

    return get(resource, ['_object', 'pkg', 'remoteKb', 'name'], '-');
  }
}
