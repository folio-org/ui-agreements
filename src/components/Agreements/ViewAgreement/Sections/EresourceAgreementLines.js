import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { MultiColumnList } from '@folio/stripes/components';

import { renderResourceType } from '../../../../util/resourceType';

export default class EresourceAgreementLines extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool,
  };

  columnWidths = {
    name: '20%',
    platform: '20%',
    type: '10%',
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
    type: <FormattedMessage id="ui-agreements.eresources.erType" />,
    count: <FormattedMessage id="ui-agreements.agreementLines.count" />,
    contentUpdated: <FormattedMessage id="ui-agreements.agreementLines.contentUpdated" />,
  }

  formatter = {
    name: line => {
      const resource = get(line.resource, ['_object', 'pti', 'titleInstance'], line.resource);
      return (
        <Link
          data-test-resource-id={line.resource.id}
          to={`/erm/eresources/view/${resource.id}`}
        >
          {resource.name}
        </Link>
      );
    },
    platform: line => (
      get(line, ['resource', '_object', 'pti', 'platform', 'name']) ||
      get(line, ['resource', '_object', 'nominalPlatform', 'name'])
    ),
    type: line => renderResourceType(line.resource),
    count: line => (get(line, ['_object', 'contentItems'], [0])).length, // If contentItems doesn't exist there's only one item.
    contentUpdated: () => 'TBD',
  }

  visibleColumns = [
    'name',
    'platform',
    'type',
    'count',
    'contentUpdated',
  ]

  render() {
    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={this.props.visible ? this.props.agreementLines : []}
        formatter={this.formatter}
        id="agreement-lines"
        interactive={false}
        maxHeight={400}
        visibleColumns={this.visibleColumns}
      />
    );
  }
}
