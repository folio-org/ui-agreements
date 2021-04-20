import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Tooltip
} from '@folio/stripes/components';

import { Pluggable } from '@folio/stripes/core';

// This must return a function to render a link button

const AgreementLookupComponent = ({id, input: { name, value }, onResourceSelected, resource }) => {
  let triggerButton = useRef(null);

  const renderAgreementLinkButton = (v) => (
    <Pluggable
      dataKey={id}
      onAgreementSelected={onResourceSelected}
      renderTrigger={(pluggableRenderProps) => {
        triggerButton = pluggableRenderProps.buttonRef;

        const agreementName = resource?.name;
        const buttonProps = {
          'aria-haspopup': 'true',
          'buttonRef': triggerButton,
          'buttonStyle': v ? 'default' : 'primary',
          'id': `${id}-find-agreement-btn`,
          'marginBottom0': true,
          'name': name,
          'onClick': pluggableRenderProps.onClick
        };

        if (value) {
          return (
            <Tooltip
              id={`${id}-agreement-button-tooltip`}
              text={<FormattedMessage id="ui-agreements.relatedAgreements.replaceAgreementSpecific" values={{ agreementName }} />}
              triggerRef={triggerButton}
            >
              {({ ariaIds }) => (
                <Button
                  aria-labelledby={ariaIds.text}
                  {...buttonProps}
                >
                  <FormattedMessage id="ui-agreements.relatedAgreements.replaceAgreement" />
                </Button>
              )}
            </Tooltip>
          );
        }
        return (
          <Button
            {...buttonProps}
          >
            <FormattedMessage id="ui-agreements.relatedAgreements.linkAgreement" />
          </Button>
        );
      }}
      type="find-agreement"
    >
      <FormattedMessage id="ui-agreements.relatedAgreements.noPlugin" />
    </Pluggable>
  );

  return (
    <>
      {renderAgreementLinkButton(value)}
      {JSON.stringify(resource, null, 2)}
    </>
  );
};

export default AgreementLookupComponent;
