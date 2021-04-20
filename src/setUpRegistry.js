import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import Registry from '@folio/plugin-resource-registry';

import {
  Button,
  FormattedUTCDate,
  NoValue,
  Tooltip
} from '@folio/stripes/components';

import { Pluggable } from '@folio/stripes/core';

const setUpRegistry = () => {
  const registry = Registry;
  // Agreement Resource
  const agreementReg = registry.registerResource('agreement');
  agreementReg.addViewAll('/erm/agreements');
  agreementReg.addViewTemplate(agreement => `/erm/agreements/${agreement.id}`);

  // Testing custom render function.
  agreementReg.setRenderFunction('currentPeriodStartDate', record => {
    const date = record.periods.find(p => p.periodStatus === 'current')?.startDate;
    return date ? <FormattedUTCDate value={date} /> :
    <NoValue />;
  });

  // Lookup plugin

  const createLookupButton = ({ id, input: { name }, onLicenseSelected }) => {
    return (value) => (
      <Pluggable
        dataKey={id}
        onLicenseSelected={onLicenseSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;

          const buttonProps = {
            'buttonStyle': value ? 'default' : 'primary',
            'buttonRef': this.triggerButton,
            'id': `${id}-find-license-btn`,
            'marginBottom0': true,
            'name': name,
            'onClick': props.onClick
          };

          if (value) {
            return (
              <Tooltip
                id={`${this.props.id}-license-button-tooltip`}
                text={<FormattedMessage id="ui-agreements.license.replaceLicenseSpecific" values={{ licenseName: get(this.props.license, 'name') }} />}
                triggerRef={this.triggerButton}
              >
                {({ ariaIds }) => (
                  <Button
                    aria-labelledby={ariaIds.text}
                    {...buttonProps}
                  >
                    <FormattedMessage id="ui-agreements.license.replaceLicense" />
                  </Button>
                )}
              </Tooltip>
            );
          }

          return (
            <Button
              {...buttonProps}
            >
              <FormattedMessage id="ui-agreements.license.linkLicense" />
            </Button>
          );
        }}
        type="find-license"
      >
        <FormattedMessage id="ui-agreements.license.noFindLicensePlugin" />
      </Pluggable>
    );
  };

  // AgreementLine Resource
  const aglReg = registry.registerResource('agreementLine');
  aglReg.addViewTemplate(al => `/erm/agreements/${al.owner?.id}/line/${al.id}`);
};

export default setUpRegistry;
