import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import setFieldData from 'final-form-set-field-data';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  ButtonGroup,
  Col,
  ExpandAllButton,
  Pane,
  PaneFooter,
  Paneset,
  Row,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormInfo, FormPOLines, FormCoverage, FormEresource } from '../AgreementLineSections';
import IfEResourcesEnabled from '../IfEResourcesEnabled';

import { isDetached, isExternal } from '../utilities';

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
    change: PropTypes.func,
    getRegisteredFields: PropTypes.func.isRequired,
  }).isRequired,
  handlers: PropTypes.PropTypes.shape({
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    onAgreementLineSourceClick:  PropTypes.func,
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  isEholdingsEnabled: PropTypes.bool,
  lineId: PropTypes.string,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.object,
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
}) => {
  const hasLoaded = form.getRegisteredFields().length > 0;
  const resource = isExternal(line) ? line : (line.resource?._object ?? {});

  const [agreementLineSource, setAgreementLineSource] = useState('basket');

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

  return (
    <Paneset>
      <Pane
        appIcon={<AppIcon app="agreements" />}
        centerContent
        defaultWidth="100%"
        dismissible
        footer={(
          <PaneFooter
            renderEnd={(
              <Button
                buttonStyle="primary mega"
                disabled={pristine || submitting}
                id="clickable-update-agreement-line"
                marginBottom0
                onClick={handleSubmit}
                type="submit"
              >
                <FormattedMessage id="stripes-components.saveAndClose" />
              </Button>
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
        {
          (!line.id || isDetached(line)) && ( // render button group on edit only for detached line type
            isEholdingsEnabled ? (
              <IfEResourcesEnabled>
                {({ isEnabled }) => {
                  if (isEnabled) {
                    return (
                      <ButtonGroup>
                        {renderBasketButton()}
                        {renderEholdingsButton()}
                      </ButtonGroup>
                    );
                  } else {
                    setAgreementLineSource('eholdings');
                    return null;
                  }
                }}
              </IfEResourcesEnabled>
            ) : (
              <IfEResourcesEnabled>
                {({ isEnabled }) => {
                  if (isEnabled) {
                    setAgreementLineSource('basket');
                  } else {
                    setAgreementLineSource('');
                  }

                  return null;
                }}
              </IfEResourcesEnabled>
            )
          )
        }
        <FormEresource
          agreementLineSource={agreementLineSource}
          basket={basket}
          change={form.change}
          form={form}
          line={line}
          lineId={lineId}
          setFieldData={form.mutators.setFieldData}
          values={values}
        />
        <FormInfo
          isSuppressFromDiscoveryEnabled={handlers.isSuppressFromDiscoveryEnabled}
        />
        <AccordionStatus>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton id="clickable-expand-all" />
            </Col>
          </Row>
          <AccordionSet>
            <FormPOLines
              line={line}
            />
            {
              agreementLineSource === 'basket' &&
              <FormCoverage
                addButtonTooltipId="ui-agreements.agreementLine.addCustomCoverageTootlip"
                line={line}
                resource={resource}
                values={values}
              />
            }
          </AccordionSet>
        </AccordionStatus>
      </Pane>
    </Paneset>
  );
};

AgreementLineForm.propTypes = propTypes;

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  keepDirtyOnReinitialize: true,
  subscription: {
    values: true,
  },
  mutators: { setFieldData },
  navigationCheck: true,
})(AgreementLineForm);
