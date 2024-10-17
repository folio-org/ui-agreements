import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { NoValue } from '@folio/stripes/components';

import { isExternal } from '../utilities';

export default class EResourceCount extends React.Component {
  static propTypes = {
    resource: PropTypes.shape({
      _object: PropTypes.shape({
        resourceCount: PropTypes.number,
      }),
      authority: PropTypes.string,
      reference_object: PropTypes.shape({
        selectedCount: PropTypes.number,
        titleCount: PropTypes.number,
        isSelected: PropTypes.bool
      }),
      resourceCount: PropTypes.number,
      selectedCount: PropTypes.number,
      titleCount: PropTypes.number,
      /*
       * Type here could be the line type,
       * or the resource type, depending on the return value
       * of getResourceFromEntitlement.
       *
       * We should probably shore up return type of that function.
       */
      type: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          value: PropTypes.string
        })
      ]),
    })
  }

  render() {
    const { resource } = this.props;
    if (isEmpty(resource)) return null;

    // AL w/o resource
    if (resource.type === 'detached') {
      return <NoValue />;
    }

    if (isExternal(resource)) {
      const { reference_object: { isSelected, titleCount, selectedCount } = {} } = resource;

      if (titleCount >= 0) {
        return selectedCount >= 0 ? `${selectedCount} / ${titleCount}` : titleCount;
      }

      if (resource?.authority === 'EKB-TITLE') {
        return isSelected ? '1 / 1' : '0 / 1';
      }
    }

    if (resource.titleCount && resource.titleCount >= 0) {
      return resource?.selectedCount >= 0 ? `${resource.selectedCount} / ${resource.titleCount}` : resource.titleCount;
    }

    return (
      resource.resourceCount ??
      resource._object?.resourceCount ??
      1
    );
  }
}
