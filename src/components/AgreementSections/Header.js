import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  FormattedUTCDate,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import css from './Header.css';

export default class Header extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      agreementStatus: PropTypes.shape({
        label: PropTypes.string,
      }),
      endDate: PropTypes.string,
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          org: PropTypes.shape({
            name: PropTypes.string,
          }),
          roles: PropTypes.arrayOf(PropTypes.object),
        }),
      ),
      startDate: PropTypes.string,
    }).isRequired,
  };

  renderPrimaryOrg = () => {
    const { agreement: { orgs = [] } } = this.props;
    const primaryOrg = orgs.find(o => o.primaryOrg === true);
    return primaryOrg?.org?.name || <FormattedMessage id="ui-agreements.notSet" />;
  }

  render() {
    const { agreement } = this.props;
    const { startDate, endDate } = agreement;

    return (
      <Row className={css.agreementHeader}>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.startDate" />}>
            <div data-test-agreement-start-date>
              {startDate ? <FormattedUTCDate value={startDate} /> : <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.endDate" />}>
            <div data-test-agreement-end-date>
              {endDate ? <FormattedUTCDate value={endDate} /> : <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}>
            <div data-test-agreement-status>
              {agreement?.agreementStatus?.label ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.organizations.primary" />}>
            <div data-test-agreement-primary-org-name>
              {this.renderPrimaryOrg()}
            </div>
          </KeyValue>
        </Col>
      </Row>
    );
  }
}
