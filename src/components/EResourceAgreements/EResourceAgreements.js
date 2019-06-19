
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { MultiColumnList } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import EResourceLink from '../EResourceLink';
import ResourceType from '../ResourceType';
import CoverageStatements from '../CoverageStatements';
import CustomCoverageIcon from '../CustomCoverageIcon';
import getResourceFromEntitlement from '../utilities/getResourceFromEntitlement';

import { urls } from '../utilities';

export default class EResourceAgreements extends React.Component {
  visibleColumns = () => ([
    'name',
    'type',
    'startDate',
    'endDate',
    ...(this.props.eResourceType === 'title' ?
      [
        'package',
        'acqMethod',
        'coverage',
        'isCustomCoverage'
      ] : []
    ),
  ]);

  formatter = () => ({
    name: ({ owner }) => <Link to={urls.agreementView(owner.id)}>{owner.name}</Link>,
    type: ({ owner }) => owner.agreementStatus && owner.agreementStatus.label,
    startDate: ({ owner }) => owner.startDate && <FormattedDate value={owner.startDate} />,
    endDate: ({ owner }) => owner.endDate && <FormattedDate value={owner.endDate} />,
    package: (line) => <EResourceLink eresource={getResourceFromEntitlement(line)} />,
    acqMethod: ({ resource }) => <ResourceType resource={resource} />,
    coverage: line => <CoverageStatements statements={line.coverage} />,
    isCustomCoverage: line => (line.customCoverage ? <CustomCoverageIcon /> : ''),
  });

  columnMapping = () => ({
    name: <FormattedMessage id="ui-agreements.agreements.name" />,
    type: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
    startDate: <FormattedMessage id="ui-agreements.agreements.startDate" />,
    endDate: <FormattedMessage id="ui-agreements.agreements.endDate" />,
    package: <FormattedMessage id="ui-agreements.eresources.parentPackage" />,
    acqMethod: <FormattedMessage id="ui-agreements.eresources.acqMethod" />,
    coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
    isCustomCoverage: ' ',
  });

  columnWidths = () => ({
    startDate: 120,
    endDate: 120,
  });

  render() {
    const { agreements } = this.props;

    if (!agreements) return <Spinner />;

    return (
      <MultiColumnList
        contentData={agreements}
        id="eresource-agreements-list"
        interactive={false}
        maxHeight={400}
        columnMapping={this.columnMapping()}
        columnWidths={this.columnWidths()}
        formatter={this.formatter()}
        visibleColumns={this.visibleColumns()}
      />
    );
  }
}
