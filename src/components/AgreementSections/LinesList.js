import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { MultiColumnList, Tooltip } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import CoverageStatements from '../CoverageStatements';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import EResourceCount from '../EResourceCount';
import EResourceProvider from '../EResourceProvider';
import EResourceType from '../EResourceType';
import { getResourceFromEntitlement, urls } from '../utilities';

export default class LinesList extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      lines: PropTypes.arrayOf(PropTypes.object),
      orderLines: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    onNeedMoreLines: PropTypes.func.isRequired,
  }

  columnWidths = {
    name: 250,
    provider: 150,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    provider: <FormattedMessage id="ui-agreements.eresources.provider" />,
    type: <FormattedMessage id="ui-agreements.eresources.erType" />,
    count: <FormattedMessage id="ui-agreements.agreementLines.count" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
    poLine: <FormattedMessage id="ui-agreements.agreementLines.poline" />,
  }

  formatter = {
    name: line => {
      const resource = getResourceFromEntitlement(line);
      if (!resource) return line.label;

      return (
        <EResourceLink
          eresource={resource}
          linkProps={{
            'data-test-resource-id': get(line, 'resource.id'),
            'data-test-external-reference': line.reference,
          }}
        />
      );
    },
    provider: line => <EResourceProvider resource={line.resource || line} />,
    type: line => <EResourceType resource={getResourceFromEntitlement(line)} />,
    count: line => <EResourceCount resource={getResourceFromEntitlement(line)} />,
    coverage: line => <CoverageStatements statements={line.coverage} />,
    isCustomCoverage: line => {
      if (!line.customCoverage) return '';
      return (
        <Tooltip
          id={`agreement-line-cc-tooltip-${line.rowIndex}`}
          text={<FormattedMessage id="ui-agreements.customcoverages.tooltip" />}
        >
          {({ ref, ariaIds }) => <CustomCoverageIcon ref={ref} aria-labelledby={ariaIds.text} />
          }
        </Tooltip>
      );
    },
    poLine: line => this.renderPOLine(line),
  }

  visibleColumns = [
    'name',
    'provider',
    'type',
    'count',
    'coverage',
    'isCustomCoverage',
    'poLine',
  ]

  renderPOLine = (line) => {
    const { orderLines } = this.props.agreement;

    if (!line.poLineId) return '';
    if (!orderLines) return <Spinner />;

    const poLine = orderLines.find(orderLine => orderLine.id === line.poLineId);
    if (!poLine) return <Spinner />;

    return (
      <Link
        data-test-po-line
        to={urls.poLineView(line.poLineId)}
      >
        {poLine.poLineNumber}
      </Link>
    );
  }

  render() {
    const {
      agreement: { lines },
      onNeedMoreLines,
    } = this.props;

    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={lines}
        formatter={this.formatter}
        id="agreement-lines"
        interactive={false}
        maxHeight={400}
        onNeedMoreData={onNeedMoreLines}
        visibleColumns={this.visibleColumns}
      />
    );
  }
}
