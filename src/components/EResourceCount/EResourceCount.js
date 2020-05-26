import React from 'react';
import PropTypes from 'prop-types';

import { isExternal } from '../utilities';

export default class EResourceCount extends React.Component {
  static propTypes = {
    resource: PropTypes.shape({
      _object: PropTypes.shape({
        resourceCount: PropTypes.number,
      }),
      reference_object: PropTypes.shape({
        titleCount: PropTypes.number,
      }),
      resourceCount: PropTypes.number,
    })
  }

  render() {
    const { resource } = this.props;
    if (!resource) return null;

    if (isExternal(resource)) {
      return resource.reference_object?.titleCount ?? 1;
    }

    return (
      resource.resourceCount ??
      resource._object?.resourceCount ??
      1
    );
  }
}
