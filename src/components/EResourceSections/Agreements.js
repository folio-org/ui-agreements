import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { Badge, Headline, MultiColumnList } from '@folio/stripes/components';
import { Spinner } from '@folio/stripes-erm-components';

import CoverageStatements from '../CoverageStatements';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import ResourceType from '../ResourceType';
import { getResourceFromEntitlement, urls } from '../utilities';

export default class Agreements extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      entitlements: PropTypes.array,
      eresource: PropTypes.shape({
        type: PropTypes.object,
      }),
    }),
  };

  renderAgreements = () => {
    const isTitle = this.props.data.eresource.type !== undefined;

    return (
      <MultiColumnList
        contentData={this.props.data.entitlements}
        formatter={{
          name: ({ owner }) => <Link to={urls.agreementView(owner.id)}>{owner.name}</Link>,
          type: ({ owner }) => get(owner, 'agreementStatus.label', ''),
          startDate: ({ owner }) => owner.startDate && <FormattedDate value={owner.startDate} />,
          endDate: ({ owner }) => owner.endDate && <FormattedDate value={owner.endDate} />,
          package: (line) => <EResourceLink eresource={getResourceFromEntitlement(line)} />,
          acqMethod: ({ resource }) => <ResourceType resource={resource} />,
          coverage: line => <CoverageStatements statements={line.coverage} />,
          isCustomCoverage: line => line.customCoverage && <CustomCoverageIcon />,
        }}
        columnMapping={{
          name: <FormattedMessage id="ui-agreements.agreements.name" />,
          type: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
          startDate: <FormattedMessage id="ui-agreements.agreements.startDate" />,
          endDate: <FormattedMessage id="ui-agreements.agreements.endDate" />,
          package: <FormattedMessage id="ui-agreements.eresources.parentPackage" />,
          acqMethod: <FormattedMessage id="ui-agreements.eresources.acqMethod" />,
          coverage: <FormattedMessage id="ui-agreements.eresources.coverage" />,
          isCustomCoverage: ' ',
        }}
        columnWidths={{
          startDate: 120,
          endDate: 120,
        }}
        interactive={false}
        visibleColumns={[
          'name',
          'type',
          'startDate',
          'endDate',
          ...(isTitle ? ['package', 'acqMethod', 'coverage', 'isCustomCoverage'] : []),
        ]}
      />
    );
  }

  renderLoading = () => (
    <Spinner />
  )

  renderBadge = () => {
    const count = get(this.props.data, 'entitlementOptions.length');
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const { data: { entitlements } } = this.props;

    return (
      <div id="eresource-agreements">
        <Headline faded margin="none" size="large">
          <FormattedMessage id="ui-agreements.eresources.erAgreements" />
        </Headline>
        { entitlements ? this.renderAgreements() : this.renderLoading() }
      </div>
    );
  }
}
