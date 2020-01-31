import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Badge,
  FormattedUTCDate,
  MultiColumnList,
  Spinner
} from '@folio/stripes/components';

import { SerialCoverage } from '../Coverage';
import CustomCoverageIcon from '../CustomCoverageIcon';
import EResourceLink from '../EResourceLink';
import EResourceType from '../EResourceType';
import { getResourceFromEntitlement, urls } from '../utilities';

export default class Agreements extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      entitlements: PropTypes.array,
      eresource: PropTypes.shape({
        type: PropTypes.object,
      }),
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderAgreements = () => {
    const isTitle = this.props.data.eresource.type !== undefined;

    return (
      <MultiColumnList
        contentData={this.props.data.entitlements}
        formatter={{
          name: ({ owner: agreement }) => <Link to={urls.agreementView(agreement.id)}>{agreement.name}</Link>,
          type: ({ owner: agreement }) => get(agreement, 'agreementStatus.label', ''),
          startDate: ({ owner: agreement }) => agreement.startDate && <FormattedUTCDate value={agreement.startDate} />,
          endDate: ({ owner: agreement }) => agreement.endDate && <FormattedUTCDate value={agreement.endDate} />,
          package: (line) => <EResourceLink eresource={getResourceFromEntitlement(line)} />,
          acqMethod: ({ resource }) => <EResourceType resource={resource} />,
          coverage: line => <SerialCoverage statements={line.coverage} />,
          isCustomCoverage: line => line.customCoverage && <CustomCoverageIcon />,
        }}
        columnMapping={{
          name: <FormattedMessage id="ui-agreements.agreements.name" />,
          type: <FormattedMessage id="ui-agreements.agreements.agreementStatus" />,
          startDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodStart" />,
          endDate: <FormattedMessage id="ui-agreements.agreementPeriods.periodEnd" />,
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

  renderBadge = () => {
    const count = get(this.props.data, 'entitlements.length');
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const {
      data: { entitlements, eresource: { type } },
      id,
      onToggle,
      open,
    } = this.props;

    const label = type ?
      <FormattedMessage id="ui-agreements.eresources.erAgreements" /> :
      <FormattedMessage id="ui-agreements.eresources.packageAgreements" />;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={label}
        onToggle={onToggle}
        open={open}
      >
        {entitlements ? this.renderAgreements() : <Spinner />}
      </Accordion>
    );
  }
}
