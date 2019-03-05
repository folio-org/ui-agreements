import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { LicenseCard } from '@folio/stripes-erm-components';

export default class LicenseLookup extends React.Component {
  static propTypes = {
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
    // TL; DR, don't change this to track the license object as part of `this.state` instead of
    // `this.props` without understanding the consequences.
    //
    // The parent should pass down the `license` object that was passed to it with
    // onSelectLicense(). We move the holding of the `license` object to the parent
    // because it's actually not possible to use `state` for this because of the
    // way React recycles components rendered from an array.
    // Eg, If we render this component several times when mapped out of an array, and if
    // the `key` for it is just the array index, then upon deleting the nth entry, the
    // n+k'th component will "slide" up to the n+k-1'th spot. However, React will not
    // change the `state` as part of that operation since the key will remain the same.
    // Alternatively, if we set the key as the license's `id`, then in `handleLicenseSelected`
    // we'll call setState to change the state.license, followed by `input.onChange`, which
    // will trigger a rerender of our parent. The parent will now render a _new_ component with
    // key being the license ID we passed it, wiping away the state we just set.

    return this.props.license ? this.renderLicense() : this.renderLookup();
  }
}
