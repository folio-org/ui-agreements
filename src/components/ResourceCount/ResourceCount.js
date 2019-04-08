import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import isExternal from '../../util/isExternal';

export default class ResourceCount extends React.Component {
  static propTypes = {
    resource: PropTypes.shape({
      _object: PropTypes.shape({
        contentItems: PropTypes.array,
      }),
      reference_object: PropTypes.shape({
        titleCount: PropTypes.number,
      }),
    })
  }

  render() {
    const { resource } = this.props;
    if (!resource) return null;

    if (isExternal(resource)) {
      return get(resource, ['reference_object', 'titleCount'], 1);
    }

    // If contentItems doesn't exist there's only one item.
    return get(resource, ['_object', 'contentItems', 'length'], 1);
  }
}
