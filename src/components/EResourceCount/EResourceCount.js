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
        selectedCount: PropTypes.number,
        titleCount: PropTypes.number,
      }),
      resourceCount: PropTypes.number,
    })
  }

  render() {
    const { resource } = this.props;
    if (!resource) return null;

    if (isExternal(resource)) {
      const { reference_object: { titleCount, selectedCount } = {} } = resource;

      if (titleCount >= 0) {
        return selectedCount >= 0 ? `${selectedCount} / ${titleCount}` : titleCount;
      }

      return 1;
    }

    return (
      resource.resourceCount ??
      resource._object?.resourceCount ??
      1
    );
  }
}
