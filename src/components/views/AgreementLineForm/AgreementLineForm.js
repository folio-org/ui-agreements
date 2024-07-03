import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import setFieldData from 'final-form-set-field-data';
import { handleSaveKeyCommand } from '@folio/stripes-erm-components';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  ButtonGroup,
  Checkbox,
  Col,
  ExpandAllButton,
  HasCommand,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  checkScope,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import css from './AgreementLineForm.css';
import { FormInfo, FormPOLines, FormCoverage, FormEresource } from '../../AgreementLineSections';

import { isDetached, isExternal } from '../../utilities';
import { useEresourcesEnabled } from '../../../hooks';

const propTypes = {
  data: PropTypes.shape({
    basket: PropTypes.arrayOf(PropTypes.object),
    line: PropTypes.shape({
      resource: PropTypes.shape({
        _object: PropTypes.object,
      }),
    }),
    settings: PropTypes.object,
  }),
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setFieldData: PropTypes.func,
    }),
    getRegisteredFields: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  handlers: PropTypes.PropTypes.shape({
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  isEholdingsEnabled: PropTypes.bool,
  lineId: PropTypes.string,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  createAnother: PropTypes.bool,
  toggleCreateAnother: PropTypes.func.isRequired,
};

const AgreementLineForm = ({
  data: { basket = [], line = {} },
  form,
  handlers,
  handleSubmit,
  isEholdingsEnabled,
  lineId = '',
  pristine,
  submitting,
  values,
  createAnother = false,
  toggleCreateAnother,
}) => {
  const hasLoaded = form.getRegisteredFields().length > 0;
  const resource = isExternal(line) ? line : (line.resource?._object ?? {});
  const [agreementLineSource, setAgreementLineSource] = useState('basket');

  const isEresourcesEnabled = useEresourcesEnabled();

  const accordionStatusRef = useRef();
  /* istanbul ignore next */
  const shortcuts = [
    {
      name: 'save',
      handler: (e) => { handleSaveKeyCommand(e, { handleSubmit, pristine, submitting }); if (createAnother) { form.reset(); } },
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef)
    }
  ];

  const getSectionProps = () => {
    return {
      addButtonTooltipId: 'ui-agreements.agreementLine.addCustomCoverageTootlip',
      agreementLineSource,
      basket,
      isSuppressFromDiscoveryEnabled: handlers.isSuppressFromDiscoveryEnabled,
      line,
      lineId,
      resource,
      setFieldData: form.mutators.setFieldData,
      values,
    };
  };

  /* istanbul ignore next */
  const renderBasketButton = () => {
    return (
      <Button
        buttonStyle={agreementLineSource === 'basket' ? 'primary' : 'default'}
        disabled={agreementLineSource === 'eholdings' && !isEmpty(values.linkedResource)}
        id="clickable-nav-agreements"
        onClick={() => { setAgreementLineSource('basket'); }}
      >
        <FormattedMessage id="ui-agreements.agreementLine.basket" />
      </Button>
    );
  };

  /* istanbul ignore next */
  const renderEholdingsButton = () => {
    return (
      <Button
        buttonStyle={agreementLineSource === 'eholdings' ? 'primary' : 'default'}
        disabled={agreementLineSource === 'basket' && !isEmpty(values.linkedResource)}
        id="clickable-nav-eresources"
        onClick={() => { setAgreementLineSource('eholdings'); }}
      >
        <FormattedMessage id="ui-agreements.agreementLine.eholdings" />
      </Button>
    );
  };


  const renderButtonGroup = () => {
    if ((!!line.id && !isDetached(line))) {
      return null;
    }

    if (isEholdingsEnabled && isEresourcesEnabled) {
      return (
        <ButtonGroup>
          {renderBasketButton()}
          {renderEholdingsButton()}
        </ButtonGroup>
      );
    } else if (isEholdingsEnabled && agreementLineSource !== 'eholdings') {
      setAgreementLineSource('eholdings');
      return null;
    } else if (isEresourcesEnabled && agreementLineSource !== 'basket') {
      setAgreementLineSource('basket');
      return null;
    } else if (!isEholdingsEnabled && !isEresourcesEnabled && agreementLineSource !== '') {
      setAgreementLineSource('');
    }

    return null;
  };

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <Pane
          appIcon={<AppIcon app="agreements" iconKey="agreementLine" />}
          centerContent
          defaultWidth="100%"
          dismissible
          footer={(
            <PaneFooter
              renderEnd={(
                <>
                  <span className={css.createAnotherCheckbox}>
                    <Checkbox
                      component={Checkbox}
                      id="agreement-line-create-another"
                      inline
                      label={<FormattedMessage id="ui-agreements.agreementLines.createAnother" />}
                      onChange={e => toggleCreateAnother(e.target.checked)}
                      type="checkbox"
                      vertical
                    />
                  </span>
                  <Button
                    buttonStyle="primary mega"
                    disabled={pristine || submitting}
                    id="clickable-update-agreement-line"
                    marginBottom0
                    onClick={() => {
                      handleSubmit(values);
                      if (createAnother) { form.reset(); }
                    }}
                    type="submit"
                  >
                    <FormattedMessage id={createAnother ? 'stripes-core.button.save' : 'stripes-components.saveAndClose'} />
                  </Button>
                </>
              )}
              renderStart={(
                <Button
                  buttonStyle="default mega"
                  id="clickable-cancel"
                  marginBottom0
                  onClick={handlers.onClose}
                >
                  <FormattedMessage id="stripes-components.cancel" />
                </Button>
              )}
            />
          )}
          id="pane-agreement-line-form"
          onClose={handlers.onClose}
          paneTitle={lineId ?
            <FormattedMessage id="ui-agreements.line.edit" />
            :
            <FormattedMessage id="ui-agreements.line.new" />
          }
        >
          {hasLoaded ? <div id="form-loaded" /> : null}
          {/* Logic to render the button group. Set eholdings or basket as source based on eholdings permission / if eresources enabled */}
          {renderButtonGroup()}
          <FormEresource {...getSectionProps()} />
          <FormInfo {...getSectionProps()} />
          <AccordionStatus ref={accordionStatusRef}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton id="clickable-expand-all" />
              </Col>
            </Row>
            <AccordionSet>
              <FormPOLines {...getSectionProps()} />
              {agreementLineSource === 'basket' && <FormCoverage {...getSectionProps()} />}
            </AccordionSet>
          </AccordionStatus>
        </Pane>
      </Paneset>
    </HasCommand>
  );
};

AgreementLineForm.propTypes = propTypes;

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  keepDirtyOnReinitialize: false,
  subscription: {
    values: true,
  },
  mutators: { setFieldData },
  navigationCheck: true,
})(AgreementLineForm);
