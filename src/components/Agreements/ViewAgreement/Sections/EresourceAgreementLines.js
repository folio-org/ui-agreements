import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Icon, Layout, MultiColumnList } from '@folio/stripes/components';

import EResourceLink from '../../../EResourceLink';
import ResourceType from '../../../ResourceType';
import CoverageStatements from '../../../CoverageStatements';
import CustomCoverageIcon from '../../../CustomCoverageIcon';

export default class EresourceAgreementLines extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool,
  };

  columnWidths = {
    name: 250,
    platform: 150,
    type: 100,
    coverage: 225,
    isCustomCoverage: 25,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    platform: <FormattedMessage id="ui-agreements.eresources.platform" />,
    type: <FormattedMessage id="ui-agreements.eresources.erType" />,
    count: <FormattedMessage id="ui-agreements.agreementLines.count" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
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
    platform: line => (
      get(line, ['resource', '_object', 'pti', 'platform', 'name']) ||
      get(line, ['resource', '_object', 'nominalPlatform', 'name'])
    ),
    type: line => <ResourceType resource={line.resource} />,
    count: line => (get(line, ['_object', 'contentItems'], [0])).length, // If contentItems doesn't exist there's only one item.
    coverage: line => <CoverageStatements statements={line.coverage} />,
    isCustomCoverage: line => (line.customCoverage ? <CustomCoverageIcon /> : ''),
  }

  visibleColumns = [
    'name',
    'platform',
    'type',
    'count',
    'coverage',
    'isCustomCoverage',
  ]

  renderCustomCoverage = () => {
    return (
      <Layout
        className="flex"
        data-test-custom-coverage
      >
        <Icon icon="clock" status="success" />
      </Layout>
    );
  }

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
