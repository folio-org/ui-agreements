import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

const propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onAgreementSelected: PropTypes.func.isRequired,
};

const AgreementSearchButton = ({ disabled, name, onAgreementSelected }) => {
  let triggerButton = useRef(null);
  return (
    <Pluggable
      dataKey={`agreement-filter-button-${name}`}
      onAgreementSelected={onAgreementSelected}
      renderTrigger={(pluggableRenderProps) => {
        triggerButton = pluggableRenderProps.buttonRef;
        const buttonProps = {
          'aria-haspopup': 'true',
          'buttonRef': triggerButton,
          'id': `${name}-agreement-search-button`,
          'onClick': pluggableRenderProps.onClick,
        };
        return (
          <Button
            disabled={disabled}
            marginBottom0
            {...buttonProps}
          >
            <FormattedMessage
              id="ui-agreements.agreementLines.selectAgreement"
            />
          </Button>
        );
      }}
      type="find-agreement"
    >
      <FormattedMessage id="ui-agreements.agreementLines.noAgreementPlugin" />
    </Pluggable>
  );
};

AgreementSearchButton.propTypes = propTypes;

export default AgreementSearchButton;
