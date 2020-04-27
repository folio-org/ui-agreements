import React from 'react';
import PropTypes from 'prop-types';

export default class EResourceProvider extends React.Component {
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
      resource?._object?.pkg?.vendor?.name ||
      resource?._object?.vendor?.name ||
      resource?.reference_object?.provider || // eslint-disable-line camelcase
      null
    );
  }
}
