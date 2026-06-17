import React, { useCallback } from 'react';
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

import { EResourceType } from '@folio/stripes-erm-components';
import { usePrevNextPagination } from '@k-int/stripes-kint-components';

import Coverage from '../../Coverage';
import CustomCoverageIcon from '../../CustomCoverageIcon';
import EResourceLink from '../../EResourceLink';
import EResourceCount from '../../EResourceCount';
import EResourceProvider from '../../EResourceProvider';
import { useAgreementsDisplaySettings } from '../../../hooks';
import { AGREEMENT_LINES_PAGINATION_ID, LINE_LISTING_COLUMN_MAPPING } from '../../../constants';
import {
  getResourceFromEntitlement,
  isDetached,
  isExternal,
  urls,
  parseMclPageSize
} from '../../utilities';

const propTypes = {
  agreement: PropTypes.shape({
    id: PropTypes.string,
    agreementLinesCount: PropTypes.number,
    lines: PropTypes.arrayOf(PropTypes.object),
    orderLines: PropTypes.arrayOf(PropTypes.object),
    areOrderLinesLoading: PropTypes.bool,
  }).isRequired,
  onViewAgreementLine: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
};

const columnMapping = {
  ...LINE_LISTING_COLUMN_MAPPING,
  isCustomCoverage: ' ',
};

const LinesList = ({
  agreement: { id: agreementId, agreementLinesCount, lines, orderLines, areOrderLinesLoading },
  onViewAgreementLine,
  visibleColumns
}) => {
  const settings = useAgreementsDisplaySettings();
  const agreementLinesPageSize = parseMclPageSize(settings, 'agreementLines');
  const agreementLinesPaginationId = `${AGREEMENT_LINES_PAGINATION_ID}-${agreementId}`;

  const {
    paginationMCLProps,
  } = usePrevNextPagination({
    count: agreementLinesCount,
    pageSize: agreementLinesPageSize,
    id: agreementLinesPaginationId,
    syncToLocation: false
  });

  const renderDate = date => (
    date ? <FormattedUTCDate value={date} /> : ''
  );

  const renderPOLines = (line) => {
    if (!line.poLines || !line.poLines.length) return '';
    if (!orderLines || !orderLines.length || areOrderLinesLoading) return <Spinner />;

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

  const renderErroredExternalReference = useCallback((resource) => {
    const output = [resource.authority, resource.reference].filter(Boolean).join(': ');

    return resource.resourceName ? `${output} (${resource.resourceName})` : output;
  }, []);

  const hasReferenceError = useCallback((line) => !!line?.reference_object?.error, []);

  const rowUpdater = () => orderLines.map(orderLine => orderLine.id);
  return lines ? (
    <MultiColumnList
      columnMapping={columnMapping}
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
          if (isExternal(resource) && hasReferenceError(resource)) return renderErroredExternalReference(resource);
          if (isExternal(resource) && !resource.reference_object?.label && !resource?.resourceName) return resource.reference;
          return (
            <EResourceLink
              data-test-external-reference={line.reference}
              data-test-resource-id={line?.resource?.id}
              eresource={resource}
            />
          );
        },
        provider: (agreementLine) => !hasReferenceError(agreementLine) && <EResourceProvider resource={agreementLine.resource || agreementLine} />,
        publicationType: (agreementLine) => {
          if (hasReferenceError(agreementLine)) return <></>;

          const resource = getResourceFromEntitlement(agreementLine);
          return isDetached(resource) ? <NoValue /> : <EResourceType resource={resource} />;
        },
        activeFrom: (agreementLine) => !hasReferenceError(agreementLine) && <div data-test-active-from>{renderDate(agreementLine.startDate)}</div>,
        activeTo: (agreementLine) => !hasReferenceError(agreementLine) && <div data-test-active-to>{renderDate(agreementLine.endDate)}</div>,
        count: (agreementLine) => !hasReferenceError(agreementLine) && <EResourceCount resource={getResourceFromEntitlement(agreementLine)} />,
        note: (agreementLine) => !hasReferenceError(agreementLine) && <div style={{ overflowWrap: 'break-word', maxWidth: 250, whiteSpace: 'pre-wrap' }}>{agreementLine.note}</div>,
        coverage: (agreementLine) => !hasReferenceError(agreementLine) && <Coverage line={agreementLine} />,
        isCustomCoverage: (agreementLine) => {
          if (hasReferenceError(agreementLine) || !agreementLine.customCoverage) return <></>;

          return (
            <Tooltip
              id={`agreement-line-cc-tooltip-${agreementLine.rowIndex}`}
              text={<FormattedMessage id="ui-agreements.customcoverages.tooltip" />}
            >
              {({ ref, ariaIds }) => <CustomCoverageIcon ref={ref} aria-labelledby={ariaIds.text} />
              }
            </Tooltip>
          );
        },
        poLines: (agreementLine) => {
          if (hasReferenceError(agreementLine)) return <></>;

          return (
            <IfPermission perm="orders.po-lines.collection.get">
              {({ hasPermission }) => {
                if (hasPermission) return renderPOLines(agreementLine);

                return agreementLine?.poLines?.length
                  ? <FormattedMessage id="ui-agreements.agreementLines.noPoLinePerm" />
                  : null;
              }}
            </IfPermission>
          );
        }
      }}
      id="agreement-lines"
      isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.agreementLines" />}
      onRowClick={(e, row) => {
        if (e.target.tagName !== 'A') {
          onViewAgreementLine(row.id);
        }
      }}
      pagingType="click"
      rowUpdater={rowUpdater}
      totalCount={agreementLinesCount}
      visibleColumns={visibleColumns}
      {...paginationMCLProps}
    />
  ) : <Spinner />;
};

LinesList.propTypes = propTypes;
export default LinesList;
