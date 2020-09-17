import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import {
  FormattedUTCDate,
  MultiColumnList,
  NoValue,
  Spinner,
  Tooltip
} from '@folio/stripes/components';

import { EResourceType } from '@folio/stripes-erm-components';

import { Coverage } from '../Coverage';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import EResourceCount from '../EResourceCount';
import EResourceProvider from '../EResourceProvider';
import { getResourceFromEntitlement, isDetached, isExternal, urls } from '../utilities';

export default class LinesList extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      lines: PropTypes.arrayOf(PropTypes.object),
      orderLines: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    onViewAgreementLine: PropTypes.func.isRequired,
    onNeedMoreLines: PropTypes.func.isRequired,
  }

  state = {
    sortOrder: ['name', 'activeFrom', 'activeTo'],
    sortDirection: ['asc', 'desc'],
  };

  columnWidths = {
    name: 250,
    provider: 150,
    coverage: { min: 250, max: 320 },
  }

  sortMap = {
    name: line => {
      const resource = getResourceFromEntitlement(line);
      if (!resource) return line.label;
      if (isDetached(resource)) return resource.description;
      if (isExternal(resource)) return line?.reference_object?.label;

      return line?.resource?.name;
    },
    activeFrom: line => line.startDate,
    activeTo: line => line.endDate,
  }

  columnMapping = {
    name: <FormattedMessage id="ui-agreements.eresources.nameDescription" />,
    provider: <FormattedMessage id="ui-agreements.eresources.provider" />,
    publicationType: <FormattedMessage id="ui-agreements.eresources.publicationType" />,
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
      if (isDetached(resource)) return resource.description;

      return (
        <EResourceLink
          data-test-external-reference={line.reference}
          data-test-resource-id={line?.resource?.id}
          eresource={resource}
        />
      );
    },
    provider: line => <EResourceProvider resource={line.resource || line} />,
    publicationType: line => {
      const resource = getResourceFromEntitlement(line);
      return isDetached(resource) ? <NoValue /> : <EResourceType resource={resource} />;
    },
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
    'publicationType',
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

  onSort = (e, meta) => {
    if (!this.sortMap[meta.name]) return;

    let {
      sortOrder,
      sortDirection,
    } = this.state;

    if (sortOrder[0] !== meta.name) {
      sortOrder = [meta.name, sortOrder[0]];
      sortDirection = ['asc', sortDirection[0]];
    } else {
      const direction = (sortDirection[0] === 'desc') ? 'asc' : 'desc';
      sortDirection = [direction, sortDirection[1]];
    }

    this.setState({ sortOrder, sortDirection });
  }

  render() {
    const {
      agreement: { lines, orderLines },
      onViewAgreementLine,
      onNeedMoreLines,
    } = this.props;

    const {
      sortOrder,
      sortDirection,
    } = this.state;

    // eslint-disable-next-line no-undef
    const contentData = _.orderBy(lines,
      [this.sortMap[sortOrder[0]], this.sortMap[sortOrder[1]], this.sortMap[sortOrder[2]]], sortDirection);

    const rowUpdater = () => orderLines.map(orderLine => orderLine.id);

    return (
      <MultiColumnList
        columnMapping={this.columnMapping}
        columnWidths={this.columnWidths}
        contentData={contentData}
        formatter={this.formatter}
        id="agreement-lines"
        isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.agreementLines" />}
        maxHeight={400}
        onHeaderClick={this.onSort}
        onNeedMoreData={onNeedMoreLines}
        onRowClick={(e, row) => {
          if (e.target.tagName !== 'A') {
            onViewAgreementLine(row.id);
          }
        }}
        rowUpdater={rowUpdater}
        sortDirection={`${sortDirection[0]}ending`}
        sortOrder={sortOrder[0]}
        visibleColumns={this.visibleColumns}
      />
    );
  }
}
