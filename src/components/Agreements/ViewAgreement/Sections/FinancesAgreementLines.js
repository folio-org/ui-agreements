import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { MultiColumnList } from '@folio/stripes/components';

import EResourceLink from '../../../EResourceLink';
import ResourceType from '../../../ResourceType';

export default class FinancesAgreementLines extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
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

  formatter = {
    name: line => {
      const resource = get(line.resource, ['_object', 'pti', 'titleInstance'], line.resource);

      if (!resource) return line.label;

      return (
        <EResourceLink
          eresource={resource}
          linkProps={{ 'data-test-resource-id': line.resource.id }}
        />
      );
    },
    type:      line => <ResourceType resource={line.resource} />,
    costType: _line => ' ',
    gross:    _line => '1799.99',
    net:      _line => '1634.74',
    tax:      _line => '165.25',
    poline:   _line => ' ',
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
    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={this.props.visible ? this.props.agreementLines : []}
        formatter={this.formatter}
        id="finances-agreement-lines"
        interactive={false}
        maxHeight={400}
        visibleColumns={this.visibleColumns}
      />
    );
  }
}
