import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@folio/stripes-components';

class License extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  render() {
    const { agreement, stripes: { intl } } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.agreements.license' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        -
      </Accordion>
    );
  }
}

export default License;
