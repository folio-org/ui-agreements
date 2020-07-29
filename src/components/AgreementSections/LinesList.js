import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import {
  FormattedUTCDate,
  MultiColumnList,
  Spinner,
  Tooltip
} from '@folio/stripes/components';

import { EResourceType } from '@folio/stripes-erm-components';

import { Coverage } from '../Coverage';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import EResourceCount from '../EResourceCount';
import EResourceProvider from '../EResourceProvider';
import { getResourceFromEntitlement, urls } from '../utilities';

export default class LinesList extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      lines: PropTypes.arrayOf(PropTypes.object),
      orderLines: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    onViewAgreementLine: PropTypes.func.isRequired,
    onNeedMoreLines: PropTypes.func.isRequired,
  }

  columnWidths = {
    name: 250,
    provider: 150,
    coverage: 250,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.name" />,
    provider: <FormattedMessage id="ui-agreements.eresources.provider" />,
    type: <FormattedMessage id="ui-agreements.eresources.publicationType" />,
    count: <FormattedMessage id="ui-agreements.agreementLines.count" />,
    note: <FormattedMessage id="ui-agreements.note" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
    activeFrom: <FormattedMessage id="ui-agreements.eresources.activeFrom" />,
    activeTo: <FormattedMessage id="ui-agreements.eresources.activeTo" />,
    poLines: <FormattedMessage id="ui-agreements.agreementLines.polines" />,
  }

  formatter = {
    name: line => {
      const resource = getResourceFromEntitlement(line);
      if (!resource) return line.label;

      return (
        <EResourceLink
          data-test-external-reference={line.reference}
          data-test-resource-id={line?.resource?.id}
          eresource={resource}
        />
      );
    },
    provider: line => <EResourceProvider resource={line.resource || line} />,
    type: line => <EResourceType resource={getResourceFromEntitlement(line)} />,
    activeFrom: line => <div data-test-active-from>{this.renderDate(line.startDate)}</div>,
    activeTo: line => <div data-test-active-to>{this.renderDate(line.endDate)}</div>,
    count: line => <EResourceCount resource={getResourceFromEntitlement(line)} />,
    note: line => <div style={{ overflowWrap: 'break-word', maxWidth: 250, whiteSpace: 'pre-wrap' }}>{line.note}</div>,
    coverage: line => <Coverage line={line} />,
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
    poLines: line => (
      <IfPermission perm="orders.po-lines.collection.get">
        {({ hasPermission }) => (hasPermission ?
          this.renderPOLines(line)
          :
          line?.poLines?.length ? <FormattedMessage id="ui-agreements.agreementLines.noPoLinePerm" /> : null
        )}
      </IfPermission>
    )
  }

  visibleColumns = [
    'name',
    'provider',
    'type',
    'count',
    'note',
    'coverage',
    'isCustomCoverage',
    'activeFrom',
    'activeTo',
    'poLines',
  ]

  renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : ''
  )

  renderPOLines = (line) => {
    const { orderLines } = this.props.agreement;
    if (!line.poLines || !line.poLines.length) return '';
    if (!orderLines || !orderLines.length) return <Spinner />;

    const poLines = line.poLines.map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId));
    if (!poLines.length) return <Spinner />;

    return (
      <div>
        {poLines.map((poLine = {}, i) => (
          !poLine.id ? <Spinner key={i} /> : (
            <Tooltip
              key={poLine.id}
              id={`tooltip-${line.id}-${poLine.id}`}
              placement="left"
              text={poLine.titleOrPackage}
            >
              {({ ref, ariaIds }) => (
                <div
                  ref={ref}
                  aria-labelledby={ariaIds.text}
                >
                  <Link
                    data-test-po-line
                    to={urls.poLineView(poLine.id)}
                  >
                    {poLine.poLineNumber}
                  </Link>
                </div>
              )}
            </Tooltip>
          )
        ))}
      </div>
    );
  }

  render() {
    const {
      agreement: { lines, orderLines },
      onViewAgreementLine,
      onNeedMoreLines,
    } = this.props;

    const rowUpdater = () => orderLines.map(orderLine => orderLine.id);

    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={lines}
        formatter={this.formatter}
        id="agreement-lines"
        isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.agreementLines" />}
        maxHeight={400}
        onNeedMoreData={onNeedMoreLines}
        onRowClick={(e, row) => {
          if (e.target.tagName !== 'A') {
            onViewAgreementLine(row.id);
          }
        }}
        rowUpdater={rowUpdater}
        visibleColumns={this.visibleColumns}
      />
    );
  }
}
