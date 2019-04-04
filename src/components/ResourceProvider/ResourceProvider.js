import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';


export default class ResourceProvider extends React.Component {
  static propTypes = {
    resource: PropTypes.shape({
      _object: PropTypes.shape({
        nominalPlatform: PropTypes.shape({
          name: PropTypes.string,
        }),
        pti: PropTypes.shape({
          platform: PropTypes.shape({
            name: PropTypes.string,
          })
        })
      }),
      reference_object: PropTypes.shape({
        provider: PropTypes.string,
      })
    })
  }

  render() {
    const { resource } = this.props;

    return (
      get(resource, ['_object', 'pti', 'platform', 'name']) ||
      get(resource, ['_object', 'nominalPlatform', 'name']) ||
      get(resource, ['reference_object', 'provider']) ||
      null
    );
  }
}
