import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Button,
  Icon,
} from '@folio/stripes/components';

export default class FinancesAgreementLines extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const button =
      <Button align="end">
        <Icon icon="edit">
          <FormattedMessage id="ui-agreements.agreements.editFinancesAgreementLines" />
        </Icon>
      </Button>;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.financesAgreementLines" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
        displayWhenClosed={button}
        displayWhenOpen={button}
      />
    );
  }
}
