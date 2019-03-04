import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Pluggable } from '@folio/stripes/core';
import { Button, Col, KeyValue, Row } from '@folio/stripes/components';

export default class LicenseLookup extends React.Component {
  static propTypes = {
    meta: PropTypes.shape({
      error: PropTypes.node,
      name: PropTypes.string,
    }),
    input: PropTypes.shape({
      onChange: PropTypes.func,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    }),
  }

  state = {
    license: undefined,
  }

  handleLicenseSelected = (license) => {
    this.setState({ license });

    this.props.input.onChange(license.id);
  }

  renderLicensor = () => {
    const { license: { orgs = [] } } = this.state;
    const licensor = orgs.find(o => get(o, ['role', 'value']) === 'licensor');
    const licensorName = get(licensor, ['org', 'name']) || <FormattedMessage id="ui-agreements.license.notSet" />;

    return licensorName;
  }

  renderEndDate() {
    const { license } = this.state;
    if (license.openEnded) return <FormattedMessage id="ui-agreements.license.prop.openEnded" />;
    if (license.endDate) return <FormattedDate value={license.endDate} />;

    return '-';
  }

  renderLicense = () => {
    const { license } = this.state;

    return (
      <div>
        <div>
          <strong>
            {license.name}
          </strong>
        </div>
        <Row>
          <Col xs={2}>
            <KeyValue label={<FormattedMessage id="ui-agreements.license.prop.type" />}>
              {get(license, ['type', 'label'], '-')}
            </KeyValue>
          </Col>
          <Col xs={2}>
            <KeyValue label={<FormattedMessage id="ui-agreements.license.prop.status" />}>
              {get(license, ['status', 'label'], '-')}
            </KeyValue>
          </Col>
          <Col xs={2}>
            <KeyValue label={<FormattedMessage id="ui-agreements.license.prop.startDate" />}>
              {license.startDate ? <FormattedDate value={license.startDate} /> : '-'}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.license.prop.endDate" />}>
              {this.renderEndDate()}
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.license.prop.licensor" />}>
              {this.renderLicensor()}
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  }

  renderLookup = () => (
    <span>
      <Pluggable
        type="find-license"
        onLicenseSelected={this.handleLicenseSelected}
        renderTrigger={(props) => (
          <Button
            buttonStyle="primary"
            id={props.triggerId}
            onClick={props.onClick}
          >
            <FormattedMessage id="ui-agreements.license.prop.lookup" />
          </Button>
        )}
      >
        <FormattedMessage id="ui-agreements.license.noFindLicensePlugin" />
      </Pluggable>
    </span>
  )

  render() {
    return this.state.license ? this.renderLicense() : this.renderLookup();
  }
}
