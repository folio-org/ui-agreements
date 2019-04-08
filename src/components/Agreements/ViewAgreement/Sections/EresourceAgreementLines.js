import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Icon, Layout, MultiColumnList } from '@folio/stripes/components';

import EResourceLink from '../../../EResourceLink';
import ResourceCount from '../../../ResourceCount';
import ResourceProvider from '../../../ResourceProvider';
import ResourceType from '../../../ResourceType';
import CoverageStatements from '../../../CoverageStatements';
import CustomCoverageIcon from '../../../CustomCoverageIcon';
import getResourceFromEntitlement from '../../../../util/getResourceFromEntitlement';

export default class EresourceAgreementLines extends React.Component {
  static propTypes = {
    agreementLines: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool,
  };

  columnWidths = {
    name: 250,
    provider: 150,
    type: 100,
    count: 60,
    coverage: 225,
    isCustomCoverage: 30,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    provider: <FormattedMessage id="ui-agreements.eresources.provider" />,
    type: <FormattedMessage id="ui-agreements.eresources.erType" />,
    count: <FormattedMessage id="ui-agreements.agreementLines.count" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
  }

  formatter = {
    name: line => {
      const resource = getResourceFromEntitlement(line);
      if (!resource) return line.label;

      return (
        <EResourceLink
          eresource={resource}
          linkProps={{
            'data-test-resource-id': get(line, ['resource', 'id']),
            'data-test-external-reference': line.reference,
          }}
        />
      );
    },
    provider: line => <ResourceProvider resource={line.resource || line} />,
    type: line => <ResourceType resource={getResourceFromEntitlement(line)} />,
    count: line => <ResourceCount resource={getResourceFromEntitlement(line)} />,
    coverage: line => <CoverageStatements statements={line.coverage} />,
    isCustomCoverage: line => (line.customCoverage ? <CustomCoverageIcon /> : ''),
  }

  visibleColumns = [
    'name',
    'provider',
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
