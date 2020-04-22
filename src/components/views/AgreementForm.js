import React from 'react';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import setFieldData from 'final-form-set-field-data';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  FormInfo,
  FormInternalContacts,
  FormLicenses,
  FormLines,
  FormOrganizations,
  FormRelatedAgreements,
  FormSupplementaryDocuments,
  FormSupplementaryProperties,
  FormUsageData,
} from '../AgreementSections';

class AgreementForm extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreementLines: PropTypes.array.isRequired,
      agreementLinesToAdd: PropTypes.array.isRequired,
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

  state = {
    addedLinesToAdd: false, // eslint-disable-line react/no-unused-state
    sections: {
      formInternalContacts: true,
      formLines: true,
      formLicenses: true,
      formOrganizations: true,
      formSupplementaryProperties: true,
      formSupplementaryDocs: true,
      formUsageProviders: true,
      formRelatedAgreements: true,
    }
  }

  // The `agreementLinesToAdd` must be added here rather than in the parent route
  // handler because we don't want them to be part of the initialValues.
  // After all, they're being _added_, so their presence must dirty the form.
  static getDerivedStateFromProps(props, state) {
    const formState = props.form.getState();

    if (
      props.data.agreementLinesToAdd.length &&
      state.addedLinesToAdd === false &&
      props.form.getRegisteredFields().includes('items')
    ) {
      props.form.change('items', [
        ...get(formState, 'initialValues.items', []),
        ...props.data.agreementLinesToAdd,
      ]);

      props.handlers.onBasketLinesAdded();

      return { addedLinesToAdd: true };
    }

    return null;
  }

  getSectionProps(id) {
    const { data, form, handlers, values = {} } = this.props;

    return {
      data,
      form,
      handlers,
      id,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
      values,
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
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
            id={values.id ? 'clickable-update-agreement' : 'clickable-create-agreement'}
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
        <FormattedMessage id="ui-agreements.agreements.closeEdit">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-agreement-form-button"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  render() {
    const { form, values: { id, name } } = this.props;

    const hasLoaded = form.getRegisteredFields().length > 0;

    return (
      <Paneset>
        <FormattedMessage id="ui-agreements.create">
          {create => (
            <Pane
              appIcon={<AppIcon app="agreements" />}
              centerContent
              defaultWidth="100%"
              firstMenu={this.renderFirstMenu()}
              footer={this.renderPaneFooter()}
              id="pane-agreement-form"
              paneTitle={id ? name : <FormattedMessage id="ui-agreements.agreements.createAgreement" />}
            >
              <TitleManager record={id ? name : create}>
                <form id="form-agreement">
                  <AccordionSet>
                    {hasLoaded ? <div id="form-loaded" /> : null}
                    <Row end="xs">
                      <Col xs>
                        <ExpandAllButton
                          accordionStatus={this.state.sections}
                          id="clickable-expand-all"
                          onToggle={this.handleAllSectionsToggle}
                        />
                      </Col>
                    </Row>
                    <FormInfo {...this.getSectionProps('formInfo')} />
                    <FormInternalContacts {...this.getSectionProps('formInternalContacts')} />
                    <FormLines {...this.getSectionProps('formLines')} />
                    <FormLicenses {...this.getSectionProps('formLicenses')} />
                    <FormOrganizations {...this.getSectionProps('formOrganizations')} />
                    <FormSupplementaryProperties {...this.getSectionProps('formSupplementaryProperties')} />
                    <FormSupplementaryDocuments {...this.getSectionProps('formSupplementaryDocs')} />
                    <FormUsageData {...this.getSectionProps('formUsageProviders')} />
                    <FormRelatedAgreements {...this.getSectionProps('formRelatedAgreements')} />
                  </AccordionSet>
                </form>
              </TitleManager>
            </Pane>
          )}
        </FormattedMessage>
      </Paneset>
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
})(AgreementForm);
