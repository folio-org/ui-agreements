import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Accordion, Badge, MultiColumnList } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

export default class Finances extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      orderLines: PropTypes.arrayOf(PropTypes.shape({

      }))
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  columnWidths = {
    name:     '20%',
    type:     '15%',
    costType: '15%',
    gross:    '15%',
    net:      '10%',
    tax:      '10%',
    poline:   '15%',
  }

  columnMapping = {
    name:     <FormattedMessage id="ui-agreements.eresources.name" />,
    type:     <FormattedMessage id="ui-agreements.eresources.erType" />,
    costType: <FormattedMessage id="ui-agreements.agreementLines.costType" />,
    gross:    <FormattedMessage id="ui-agreements.agreementLines.gross" />,
    net:      <FormattedMessage id="ui-agreements.agreementLines.net" />,
    tax:      <FormattedMessage id="ui-agreements.agreementLines.tax" />,
    poline:   <FormattedMessage id="ui-agreements.agreementLines.poline" />,
  }

  formatter = {
    name:     line => line.title,
    type:     () => 'TBD',
    costType: () => 'TBD',
    gross:    () => 'TBD',
    net:      () => 'TBD',
    tax:      () => 'TBD',
    poline:   line => this.renderPOLineLink(line),
  }

  visibleColumns = [
    'name',
    'type',
    'costType',
    'gross',
    'net',
    'tax',
    'poline',
  ]

  renderPOLineLink = (line = {}) => {
    const { id, poLineNumber = '-' } = line;

    if (!id) return poLineNumber;

    return (
      <Link to={`/orders/lines/view/${id}`}>
        {poLineNumber}
      </Link>
    );
  }

  renderBadge = () => {
    const count = get(this.props, 'agreement.orderLines.length');
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  renderOrderLines = () => {
    const { agreement: { orderLines } } = this.props;
    if (!orderLines.length) return <FormattedMessage id="ui-agreements.finances.none" />;

    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={orderLines}
        formatter={this.formatter}
        id="finances-agreement-lines"
        interactive={false}
        maxHeight={400}
        visibleColumns={this.visibleColumns}
      />
    );
  }

  render() {
    const {
      agreement: { orderLines },
      id,
      onToggle,
      open
    } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.financesAgreementLines" />}
        open={open}
        onToggle={onToggle}
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
      >
        { orderLines ? this.renderOrderLines() : <Spinner /> }
      </Accordion>
    );
  }
}
