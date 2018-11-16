import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Accordion } from '@folio/stripes/components';

class License extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    intl: intlShape,
  };

  render() {
    const { intl } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-agreements.agreements.license' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        -
      </Accordion>
    );
  }
}

export default injectIntl(License);
