import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import isPackage from '../../util/isPackage';

export default class ResourceType extends React.Component {
  static propTypes = {
    resource: PropTypes.shape({
      class: PropTypes.string,
      _object: PropTypes.shape({
        pti: PropTypes.shape({
          titleInstance: PropTypes.shape({
            label: PropTypes.string,
          })
        })
      })
    })
  }

  render() {
    const { resource } = this.props;
    if (!resource) return '';

    if (isPackage(resource)) {
      return <FormattedMessage id="ui-agreements.eresources.package" />;
    }

    return get(
      resource,
      ['_object', 'pti', 'titleInstance', 'type', 'label'],
      <FormattedMessage id="ui-agreements.eresources.title" />
    );
  }
}
