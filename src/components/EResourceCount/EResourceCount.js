import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { isExternal } from '../utilities';

export default class EResourceCount extends React.Component {
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
      return get(resource, 'reference_object.titleCount', 1);
    }

    return get(resource, '_object.resourceCount', 1);
  }
}
