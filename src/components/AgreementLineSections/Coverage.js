import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  FormattedUTCDate,
  MultiColumnList
} from '@folio/stripes/components';

import CustomCoverageIcon from '../CustomCoverageIcon';
import Embargo from '../Embargo';
import { isPackage } from '../utilities';

const propTypes = {
  line: PropTypes.shape({
    coverage: PropTypes.array,
    customCoverage: PropTypes.bool,
    resource: PropTypes.shape({
      _object: PropTypes.shape({
        embargo: PropTypes.object,
      }),
    }),
  }).isRequired,
  resource: PropTypes.object,
};

const Coverage = ({
  line,
  resource,
}) => {
  if (isPackage(resource)) return null;

  return (
    <Accordion
      displayWhenClosed={<Badge>{line.coverage?.length}</Badge>}
      displayWhenOpen={<Badge>{line.coverage?.length}</Badge>}
      id="agreement-line-coverage"
      label={<FormattedMessage id="ui-agreements.eresources.coverage" />}
    >
      <Embargo embargo={resource?.embargo} />
      <MultiColumnList
        columnMapping={{
          startDate: <FormattedMessage id="ui-agreements.agreements.startDate" />,
          startVolume: <FormattedMessage id="ui-agreements.agreementLines.customCoverage.startVolume" />,
          startIssue: <FormattedMessage id="ui-agreements.agreementLines.customCoverage.startIssue" />,
          endDate: <FormattedMessage id="ui-agreements.agreements.endDate" />,
          endVolume: <FormattedMessage id="ui-agreements.agreementLines.customCoverage.endVolume" />,
          endIssue: <FormattedMessage id="ui-agreements.agreementLines.customCoverage.endIssue" />,
          customCoverage: <FormattedMessage id="ui-agreements.agreementLines.customCoverage.coverageType" />,
        }}
        columnWidths={{
          startDate: 100,
          startVolume: 110,
          startIssue: 100,
          endDate: 100,
          endVolume: 100,
          endIssue: 100,
          customCoverage: 120,
        }}
        contentData={line.coverage}
        formatter={{
          customCoverage: () => (
            line.customCoverage
              ?
              (
                <>
                  <FormattedMessage id="ui-agreements.agreementLines.custom" />
                  &nbsp;
                  <CustomCoverageIcon />
                </>
              )
              :
              ''
          ),
          endDate: c => (c.endDate ? <FormattedUTCDate value={c.endDate} /> : ''),
          startDate: c => (c.startDate ? <FormattedUTCDate value={c.startDate} /> : ''),
        }}
        interactive={false}
        isEmptyMessage={<FormattedMessage id="ui-agreements.emptyAccordion.lineCoverage" />}
        rowProps={{
          labelStrings: ({ rowData }) => ([rowData.summary]),
        }}
        visibleColumns={[
          'startDate',
          'startVolume',
          'startIssue',
          'endDate',
          'endVolume',
          'endIssue',
          'customCoverage'
        ]}
      />
    </Accordion>
  );
};

Coverage.propTypes = propTypes;
export default Coverage;
