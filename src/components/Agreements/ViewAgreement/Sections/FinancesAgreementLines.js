import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { Icon, MultiColumnList } from '@folio/stripes/components';

export default class FinancesAgreementLines extends React.Component {
  static propTypes = {
    financesAgreementLines: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool,
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

  polineFormatter(line) {
    const poLineNumber = get(line, ['po_line_number']);
    if (poLineNumber === undefined) {
      return '-';
    }
    const purchaseOrderId = get(line, ['purchase_order_id']);
    const id = get(line, ['id']);
    return (<Link to={`/orders/view/${purchaseOrderId}/po-line/view/${id}`}>
              {poLineNumber}
            </Link>);
  }

  formatter = {
    name:     line => (get(line, ['title']) || '-'),
    type:     () => 'Package',
    costType: () => 'General',
    gross:    () => '1799.99',
    net:      () => '1684.23',
    tax:      () => '165.25',
    poline:   line => (this.polineFormatter(line)),
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

  render() {
    const { financesAgreementLines } = this.props;
    if (financesAgreementLines === undefined) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }
    if (!financesAgreementLines.length) {
      return <FormattedMessage id="ui-agreements.agreementLines.noPoLines" />;
    }

    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={this.props.visible ? financesAgreementLines : []}
        formatter={this.formatter}
        id="finances-agreement-lines"
        interactive={false}
        maxHeight={400}
        visibleColumns={this.visibleColumns}
      />
    );
  }
}
