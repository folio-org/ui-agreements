import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { LicenseCard } from '@folio/stripes-erm-components';

export default class LicenseLookup extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    license: PropTypes.object,
    meta: PropTypes.shape({
      error: PropTypes.node,
    }).isRequired,
    onSelectLicense: PropTypes.func.isRequired,
  }

  renderLicense = () => {
    return (
      <div id={`${this.props.id}-license-card`}>
        <LicenseCard license={this.props.license} />
      </div>
    );
  }

  renderLookup = () => {
    const { id, onSelectLicense } = this.props;

    return (
      <span>
        <Pluggable
          dataKey={id}
          type="find-license"
          onLicenseSelected={onSelectLicense}
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
      </span>
    );
  }

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
    // Alternatively, if we set the key as the license's `id`, then the state.license
    // which we set in here will be blown away when our parent rerenders because React
    // will render a _new_ component based on that new key.

    return this.props.license ? this.renderLicense() : this.renderLookup();
  }
}
