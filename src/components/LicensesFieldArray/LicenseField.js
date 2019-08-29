import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  Layout,
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import { LicenseCard } from '@folio/stripes-erm-components';

import css from './LicenseField.css';

export default class LicenseField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    index: PropTypes.number.isRequired,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string,
    }).isRequired,
    license: PropTypes.object,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onLicenseSelected: PropTypes.func.isRequired,
    onLicenseUnselected: PropTypes.func.isRequired,
  }

  static defaultProps = {
    license: {},
  }

  renderLinkLicenseButton = () => {
    const { id, onLicenseSelected } = this.props;

    return (
      <Pluggable
        dataKey={id}
        type="find-license"
        onLicenseSelected={onLicenseSelected}
        renderTrigger={(props) => (
          <Button
            buttonStyle="primary"
            id={`${id}-find-license-btn`}
            onClick={props.onClick}
          >
            <FormattedMessage id="ui-agreements.license.prop.lookup" />
          </Button>
        )}
      >
        <FormattedMessage id="ui-agreements.license.noFindLicensePlugin" />
      </Pluggable>
    );
  }

  renderUnlinkLicenseButton = () => (
    <Button
      buttonStyle="danger"
      id={`clickable-unlink-license-${this.props.index}`}
      marginBottom0
      onClick={this.props.onLicenseUnselected}
    >
      <FormattedMessage id="ui-agreements.license.unlinkLicense" />
    </Button>
  )

  renderLicense = () => {
    return (
      <div data-test-license-card-name>
        <LicenseCard license={this.props.license} />
      </div>
    );
  }

  renderEmpty = () => (
    <div>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-agreements.license.noLicenseAdded" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.license.addLicenseToStart" />
      </Layout>
    </div>
  )

  renderError = () => (
    <Layout className={`textCentered ${css.error}`}>
      <strong>
        {this.props.meta.error}
      </strong>
    </Layout>
  )

  render() {
    const {
      id,
      input: { value },
      meta: { error, touched }
    } = this.props;

    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        hasMargin
        headerStart={(
          <AppIcon app="licenses" size="small">
            <strong>
              <FormattedMessage id="ui-agreements.agreements.license" />
            </strong>
          </AppIcon>
        )}
        headerEnd={value ? this.renderUnlinkLicenseButton() : this.renderLinkLicenseButton()}
        id={id}
        roundedBorder
      >
        { value ? this.renderLicense() : this.renderEmpty() }
        { touched && error ? this.renderError() : null }
      </Card>
    );
  }
}
