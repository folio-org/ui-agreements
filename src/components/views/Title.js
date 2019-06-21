import React from 'react';
import PropTypes from 'prop-types';

export default class Package extends React.Component {
  render() {
    return (
      <pre>
        title:
        {JSON.stringify(this.props.data.eresource, null, '\t')}
      </pre>
    );
  }
}
