import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { LicenseCard } from '@folio/stripes-erm-components';

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
    license: PropTypes.object,
    onSelectLicense: PropTypes.func.isRequired,
  }

  handleLicenseSelected = (license) => {
    this.props.onSelectLicense(license);
    this.props.input.onChange(license.id);
  }

  renderLicense = () => {
    return <LicenseCard license={this.props.license} />;
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
    return this.props.license ? this.renderLicense() : this.renderLookup();
  }
}
