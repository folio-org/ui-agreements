import React from 'react';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import setFieldData from 'final-form-set-field-data';
import { checkScope, collapseAllSections, expandAllSections, composeValidators, requiredValidator } from '@folio/stripes-erm-components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';
import { Field } from 'react-final-form';


import {
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  HasCommand,
  IconButton,
  InfoPopover,
  Layout,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
  TextArea,
  TextField
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';
import css from './UrlCustomizerForm.css';

class UrlCustomizerForm extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreementLines: PropTypes.arrayOf(PropTypes.object).isRequired,
      agreementLinesToAdd: PropTypes.arrayOf(PropTypes.object).isRequired,
      supplementaryProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    form: PropTypes.shape({
      change: PropTypes.func.isRequired,
      getRegisteredFields: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired,
    }).isRequired,
    handlers: PropTypes.PropTypes.shape({
      onBasketLinesAdded: PropTypes.func.isRequired,
      onClose: PropTypes.func.isRequired,
    }),
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    values: PropTypes.object,
  }

  static defaultProps = {
    initialValues: {},
  }

  handleSaveKeyCommand = (e) => {
    const {
      handleSubmit,
      pristine,
      submitting,
    } = this.props;

    e.preventDefault();

    if (!pristine && !submitting) {
      handleSubmit();
    }
  }

  renderPaneFooter() {
    const {
      handlers,
      handleSubmit,
      pristine,
      submitting,
      values,
    } = this.props;

    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id={values.id ? 'clickable-update-url-customiser' : 'clickable-create-url-customiser'}
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
    );
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-agreements.urlCustomiser.closeEdit">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-url-customiser-form-button"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  shortcuts = [
    {
      name: 'save',
      handler: this.handleSaveKeyCommand,
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, this.accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, this.accordionStatusRef),
    }
  ];

  render() {
    const { data, form, values: { id, name } } = this.props;

    const hasLoaded = form.getRegisteredFields().length > 0;

    return (
      <HasCommand
        commands={this.shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <FormattedMessage id="ui-agreements.create">
            {create => (
              <Pane
                centerContent
                defaultWidth="100%"
                firstMenu={this.renderFirstMenu()}
                footer={this.renderPaneFooter()}
                id="pane-url-customizer-form"
                paneTitle={id ? name : <FormattedMessage id="ui-agreements.platform.newUrlCustomization" />}
              >
                <TitleManager record={id ? name : create}>
                  <form id="form-url-customization">
                    {hasLoaded ? <div id="form-loaded" /> : null}
                    <Row>
                      <Field
                        component={TextField}
                        data-test-proxy-server-setting-name-edit
                        label={<FormattedMessage id="ui-agreements.platform.urlCustomization.name" />}
                        name="name"
                        required
                        validate={composeValidators(
                          requiredValidator,
                        )}
                      />
                    </Row>
                    <Row>
                      <Field
                        component={TextArea}
                        data-test-proxy-server-setting-url-customization-code
                        fullWidth
                        label={
                          <>
                            <FormattedMessage id="ui-agreements.platform.urlCustomization.customizationCode" />
                            <InfoPopover
                              allowAnchorClick
                              buttonHref="https://wiki.folio.org/display/FOLIOtips/Proxy+server+configuration+and+URL+customizations"
                              buttonLabel={<FormattedMessage id="ui-agreements.platform.urlCustomizationCode.learnMore" />}
                              content={<FormattedMessage id="ui-agreements.platform.urlCustomizationCode.info" />}
                              contentClass={css.infoPopoverContent}
                              hideOnButtonClick
                            />
                          </>
          }
                        name="rule"
                        required
                        validate={requiredValidator}
                      />
                    </Row>
                    <Row>
                      <Layout className="display-flex flex-direction-column padding-bottom-gutter">
                        <FormattedMessage id="ui-agreements.platform.urlCustomizationCode.variables" tagName="div" />
                        <FormattedMessage id="ui-agreements.platform.urlCustomizationCode.handleBarHelpers" tagName="div" />
                      </Layout>
                    </Row>
                  </form>
                </TitleManager>
              </Pane>
            )}
          </FormattedMessage>
        </Paneset>
      </HasCommand>
    );
  }
}

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  keepDirtyOnReinitialize: true,
  subscription: {
    values: true,
  },
  mutators: { setFieldData },
  navigationCheck: true,
})(UrlCustomizerForm);
