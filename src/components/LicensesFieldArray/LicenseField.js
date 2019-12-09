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

import css from '../styles.css';

export default class LicenseField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    input: PropTypes.shape({
      value: PropTypes.string,
    }).isRequired,
    license: PropTypes.object,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onLicenseSelected: PropTypes.func.isRequired,
  }

  static defaultProps = {
    license: {},
  }

  componentDidMount() {
    if (!this.props.input.value && this.triggerButton.current) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkLicenseButton = (value) => {
    const { id, onLicenseSelected } = this.props;

    return (
      <Pluggable
        dataKey={id}
        type="find-license"
        onLicenseSelected={onLicenseSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          return (
            <Button
              buttonStyle={value ? 'default' : 'primary'}
              buttonRef={this.triggerButton}
              id={`${id}-find-license-btn`}
              marginBottom0
              onClick={props.onClick}
            >
              <FormattedMessage id={`ui-agreements.license.${value ? 'replace' : 'link'}License`} />
            </Button>
          );
        }}
      >
        <FormattedMessage id="ui-agreements.license.noFindLicensePlugin" />
      </Pluggable>
    );
  }

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
          <FormattedMessage id="ui-agreements.license.noLicenseLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-agreements.license.linkLicenseToStart" />
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
        headerEnd={this.renderLinkLicenseButton(value)}
        id={id}
        roundedBorder
      >
        {value ? this.renderLicense() : this.renderEmpty()}
        {touched && error ? this.renderError() : null}
      </Card>
    );
  }
}
