import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Headline,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class PackageResources extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    match: PropTypes.object,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { eresource } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label="E-resources in package"
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        TBD
      </Accordion>
    );
  }
}

export default PackageResources;
