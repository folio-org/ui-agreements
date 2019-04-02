
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { FormattedDate, FormattedMessage } from 'react-intl';
import {
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';

import EResourceLink from '../../EResourceLink';
import ResourceType from '../../ResourceType';
import CoverageStatements from '../../CoverageStatements';
import CustomCoverageIcon from '../../CustomCoverageIcon';
import getResourceFromEntitlement from '../../../util/getResourceFromEntitlement';

class EResourceAgreements extends React.Component {
  static manifest = Object.freeze({
    entitlements: {
      type: 'okapi',
      path: 'erm/resource/:{id}/entitlements',
      throwErrors: false, // We can get a 404 from this endpoint
      perRequest: 100,
      limitParam: 'perPage',
    },
  })

  static propTypes = {
    match: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    resources: PropTypes.shape({
      entitlements: PropTypes.object,
    }),
    type: PropTypes.oneOf(['title', 'package']),
  };

  visibleColumns = () => ([
    'name',
    'type',
    'startDate',
    'endDate',
    ...(this.props.type === 'title' ?
      [
        'package',
        'acqMethod',
        'coverage',
        'isCustomCoverage'
      ] : []
    ),
  ]);

  formatter = () => ({
    name: ({ owner }) => <Link to={`/erm/agreements/view/${owner.id}`}>{owner.name}</Link>,
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
    const { resources: { entitlements } } = this.props;

    if (!entitlements || !entitlements.records || entitlements.isPending) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }

    return (
      <MultiColumnList
        contentData={entitlements.records}
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

export default EResourceAgreements;
