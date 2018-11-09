import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

import {
  Button,
  Col,
  Icon,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './VendorInfo.css';

class VendorInfo extends React.Component {
  static propTypes = {
    agreement: PropTypes.object,
    intl: intlShape,
  };

  render() {
    const { agreement, intl } = this.props;
    const { startDate, endDate } = agreement;

    return (
      <Row className={css.vendorInfo}>
        <Col xs={3}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-agreements.agreements.vendorInfo.vendor' })}
            value={get(agreement, ['vendor', 'name'], '-')}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-agreements.agreements.startDate' })}
            value={startDate ? intl.formatDate(startDate) : '-'}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-agreements.agreements.endDate' })}
            value={endDate ? intl.formatDate(endDate) : '-'}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-agreements.agreements.vendorInfo.status' })}
            value={get(agreement, ['agreementStatus', 'label'], '-')}
          />
        </Col>
        <Col xs={3}>
          <Button>
            <Icon size="small" icon="external-link">
              {intl.formatMessage({ id: 'ui-agreements.agreements.vendorInfo.visitPlatform' })}
            </Icon>
          </Button>
        </Col>
      </Row>
    );
  }
}

export default injectIntl(VendorInfo);
