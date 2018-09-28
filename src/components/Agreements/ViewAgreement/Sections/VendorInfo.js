import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

import {
  Button,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes-components';

import css from './VendorInfo.css';

class VendorInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    intl: intlShape,
  };

  render() {
    const { agreement, intl } = this.props;

    return (
      <Row className={css.vendorInfo}>
        <Col xs={3}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-erm.agreements.vendorInfo.vendor' })}
            value={get(agreement, ['vendor', 'name'], '-')}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-erm.agreements.vendorInfo.startDate' })}
            value={intl.formatDate(Date.now())}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-erm.agreements.vendorInfo.endDate' })}
            value={intl.formatDate(Date.now())}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-erm.agreements.vendorInfo.status' })}
            value="Active"
          />
        </Col>
        <Col xs={3}>
          <Button>{intl.formatMessage({ id: 'ui-erm.agreements.vendorInfo.visitPlatform' })}</Button>
        </Col>
      </Row>
    );
  }
}

export default injectIntl(VendorInfo);
