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

export default function AgreementLineAgrFilter({ disabled, name, onAgreementSelected }) {
  let triggerButton = useRef(null);
  const renderFilterAgreementButton = () => {
    return (
      <Pluggable
        dataKey={`agreement-${name}`}
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
              key={`data-test-add-${name}-agreement-filter`}
              disabled={disabled}
              {...buttonProps}
            >
              <FormattedMessage id="ui-agreements.agreementsLine.selectAgreement" />
            </Button>
          );
        }}
        type="find-agreement"
      >
        <FormattedMessage id="ui-agreements.agreementsLine.noAgreementPlugin" />
      </Pluggable>
    );
  };

  return (
    renderFilterAgreementButton()
  );
}

AgreementLineAgrFilter.propTypes = propTypes;
AgreementLineAgrFilter.defaultProps = {
  activeFilters: {}
};
