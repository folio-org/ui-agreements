import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  Spinner,
} from '@folio/stripes/components';

import { usePrevNextPagination } from '@k-int/stripes-kint-components';

import { useAgreementsDisplaySettings } from '../../../hooks';
import {
  AGREEMENT_LINES_PAGINATION_ID,
  LINE_LISTING_COLUMN_MAPPING,
} from '../../../constants';
import { parseMclPageSize } from '../../utilities';
import getAgreementLinesListFormatter from './getAgreementLinesListFormatter';

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
      formatter={getAgreementLinesListFormatter({ areOrderLinesLoading, orderLines })}
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
