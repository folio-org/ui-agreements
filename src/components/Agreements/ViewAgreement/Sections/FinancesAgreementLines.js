import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Icon,
} from '@folio/stripes/components';

export default class FinancesAgreementLines extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.financesAgreementLines" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-agreements.agreements.edit" />
        </Icon>
      </Accordion>
    );
  }
}
