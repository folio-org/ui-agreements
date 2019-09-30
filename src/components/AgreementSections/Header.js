import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import FormattedUTCDate from '../FormattedUTCDate';
import css from './Header.css';

export default class Header extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      currentPeriod: PropTypes.shape({
        endDate: PropTypes.string,
        startDate: PropTypes.string,
      }),
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          org: PropTypes.shape({
            name: PropTypes.string,
          }),
          role: PropTypes.shape({
            value: PropTypes.string,
          }),
        }),
      ),
    }).isRequired,
  };

  renderVendor = () => {
    const { agreement: { orgs = [] } } = this.props;
    const vendor = orgs.find(o => get(o, 'role.value') === 'vendor');
    return get(vendor, 'org.name', <FormattedMessage id="ui-agreements.notSet" />);
  }

  render() {
    const { agreement } = this.props;

    return (
      <Row className={css.agreementHeader}>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreementPeriods.periodStart" />}>
            <div data-test-agreement-start-date>
              {agreement.startDate ? <FormattedUTCDate value={agreement.startDate} /> : '-'}
            </div>
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreementPeriods.periodEnd" />}>
            <div data-test-agreement-end-date>
              {agreement.endDate ? <FormattedUTCDate value={agreement.endDate} /> : '-'}
            </div>
          </KeyValue>
        </Col>
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}>
            <div data-test-agreement-status>
              {get(agreement, 'agreementStatus.label', '-')}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.vendor" />}>
            <div data-test-agreement-vendor-name>
              {this.renderVendor()}
            </div>
          </KeyValue>
        </Col>
      </Row>
    );
  }
}
