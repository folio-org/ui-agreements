import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Accordion, Badge, Icon, Layout } from '@folio/stripes/components';

import FinancesAgreementLines from './FinancesAgreementLines';

export default class Finances extends React.Component {
  static propTypes = {
    financesAgreementLines: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    invoices: PropTypes.arrayOf(PropTypes.object),
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderBadge = () => {
    const count = get(this.props.financesAgreementLines, ['length']);
    if (count === undefined) {
      return <Icon icon="spinner-ellipsis" width="10px" />;
    }
    return <Badge data-test-finances-agreement-lines-count={count}>{count}</Badge>;
  }

  renderInvoices = () => {
    const invoices = get(this.props, 'invoices', []);
    if (!invoices.length) {
      return null;
    }
    return <Layout class="textRight"><FormattedMessage id="ui-agreements.agreements.showInvoicesLink" /></Layout>;
  }

  render() {
    const { id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.financesAgreementLines" />}
        open={open}
        onToggle={onToggle}
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
      >
        {this.renderInvoices()}
        <FinancesAgreementLines
          visible={open}
          {...this.props}
        />
        <div style={{ marginLeft: '2rem' }}>
          <Accordion
            id="finance-reports"
            label={<FormattedMessage id="ui-agreements.agreements.financeReports" />}
          >
            TBD
          </Accordion>
        </div>
      </Accordion>
    );
  }
}
