import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  KeyValue,
  Layout,
  Row,
  NoValue,
} from '@folio/stripes/components';

import AddToBasketButton from '../AddToBasketButton';

export default class PackageInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      eresource: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        reference: PropTypes.string,
        source: PropTypes.string,
      })
    }).isRequired,
  }

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
        <Row between="md">
          <Col md={8} xs={12}>
            <Headline
              size="xx-large"
              tag="h2"
            >
              {eresource.name}
            </Headline>
          </Col>
          <Col>
            <Layout className="marginTop1">
              <AddToBasketButton
                key={eresource.id}
                addLabel={<FormattedMessage id="ui-agreements.eresources.addPackageToBasket" />}
                buttonProps={{ 'data-test-add-package-to-basket': true }}
                item={entitlementOption}
                removeLabel={<FormattedMessage id="ui-agreements.eresources.removePackage" />}
              />
            </Layout>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue
              label="Provider"
              value={eresource?.vendor?.name || <NoValue />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label="Source"
              value={eresource.source || <NoValue />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label="Reference"
              value={eresource.reference || <NoValue />}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
