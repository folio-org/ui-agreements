import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import {
  FormattedUTCDate,
  MultiColumnList,
  NoValue,
  Spinner,
  Tooltip
} from '@folio/stripes/components';

import { EResourceType, usePrevNextPagination } from '@folio/stripes-erm-components';

import Coverage from '../../Coverage';
import CustomCoverageIcon from '../../CustomCoverageIcon';
import EResourceLink from '../../EResourceLink';
import EResourceCount from '../../EResourceCount';
import EResourceProvider from '../../EResourceProvider';
import { useAgreementsSettings } from '../../../hooks';
import { AGREEMENT_LINES_PAGINATION_ID } from '../../../constants';
import {
  getResourceFromEntitlement,
  isDetached,
  urls,
  parseMclPageSize
} from '../../utilities';

const propTypes = {
  agreement: PropTypes.shape({
    agreementLinesCount: PropTypes.number,
    lines: PropTypes.arrayOf(PropTypes.object),
    orderLines: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onViewAgreementLine: PropTypes.func.isRequired,
  onNeedMoreLines: PropTypes.func.isRequired,
};

const LinesList = ({
  agreement: { agreementLinesCount, lines, orderLines },
  onViewAgreementLine,
  onNeedMoreLines,
}) => {
  const { settings } = useAgreementsSettings();
  const agreementLinesPageSize = parseMclPageSize(settings, 'agreementLines');

  const {
    paginationMCLProps,
  } = usePrevNextPagination({
    count: agreementLinesCount,
    pageSize: agreementLinesPageSize,
    id: AGREEMENT_LINES_PAGINATION_ID,
    syncToLocation: false
  });

  const renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : ''
  );

  const renderPOLines = (line) => {
    if (!line.poLines || !line.poLines.length) return '';
    if (!orderLines || !orderLines.length) return <Spinner />;

    const poLines = line.poLines.map(linePOL => orderLines.find(orderLine => orderLine.id === linePOL.poLineId));
    if (!poLines.length) return <Spinner />;

    return (
      <div>
        {poLines.map((poLine = {}, i) => (
          !poLine.id ? <Spinner key={i} /> : (
            <Tooltip
              key={i}
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
  };

  const rowUpdater = () => orderLines.map(orderLine => orderLine.id);
  return lines ? (
    <MultiColumnList
      columnMapping={{
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
      }}
      columnWidths={{
        name: 250,
        provider: 150,
        coverage: { min: 250, max: 320 },
      }}
      contentData={lines}
      formatter={{
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
        activeFrom: line => <div data-test-active-from>{renderDate(line.startDate)}</div>,
        activeTo: line => <div data-test-active-to>{renderDate(line.endDate)}</div>,
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
              renderPOLines(line)
              :
              line?.poLines?.length ? <FormattedMessage id="ui-agreements.agreementLines.noPoLinePerm" /> : null
            )}
          </IfPermission>
        )
      }}
      id="agreement-lines"
      isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.agreementLines" />}
      onNeedMoreData={onNeedMoreLines}
      onRowClick={(e, row) => {
        if (e.target.tagName !== 'A') {
          onViewAgreementLine(row.id);
        }
      }}
      pagingType="click"
      rowUpdater={rowUpdater}
      totalCount={agreementLinesCount}
      visibleColumns={[
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
      ]}
      {...paginationMCLProps}
    />
  ) : <Spinner />;
};

LinesList.propTypes = propTypes;
export default LinesList;
