import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Icon,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import AddToBasketButton from '../AddToBasketButton';

export default class PackageInfo extends React.Component {
  render() {
    const { data: { eresource } } = this.props;
    const entitlementOption = {
      class: 'org.olf.kb.Pkg',
      id: eresource.id,
      name: eresource.name,
      _object: eresource,
    };

    return (
      <div id="package-info">
        <Row>
          <Col xs={6}>
            <AddToBasketButton
              key={eresource.id}
              addLabel={
                <Icon icon="plus-sign">
                  <FormattedMessage id="ui-agreements.eresources.addPackage" />
                </Icon>
              }
              item={entitlementOption}
              buttonProps={{ 'data-test-add-package-to-basket': true }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue
              label="Provider"
              value="-"
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label="Source"
              value={eresource.source || '-'}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label="Reference"
              value={eresource.reference || '-'}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
