import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
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
  FormSupplementaryInfo,
  FormUsageData,
} from '../AgreementSections';

import css from './AgreementForm.css';

class AgreementForm extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      agreementLines: PropTypes.array.isRequired,
      agreementLinesToAdd: PropTypes.array.isRequired,
    }).isRequired,
    form: PropTypes.shape({
      change: PropTypes.func.isRequired,
      getRegisteredFields: PropTypes.func.isRequired,
    }).isRequired,
    handlers: PropTypes.PropTypes.shape({
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
    addedLinesToAdd: false,
    sections: {
      formInternalContacts: true,
      formLines: true,
      formLicenses: true,
      formOrganizations: true,
      formSupplementaryInfo: true,
      formUsageProviders: true,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.data.agreementLinesToAdd.length &&
      state.addedLinesToAdd === false &&
      props.form.getRegisteredFields().includes('items')
    ) {
      props.form.change('items', [
        ...(props.initialValues.items || []),
        ...props.data.agreementLinesToAdd,
      ]);

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
    const { handleSubmit, initialValues = {}, pristine, submitting } = this.props;

    const startButton = (
      <Button
        buttonStyle="default mega"
        id="clickable-cancel"
        marginBottom0
        onClick={this.props.handlers.onClose}
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        disabled={pristine || submitting}
        id={initialValues.id ? 'clickable-update-agreement' : 'clickable-create-agreement'}
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={startButton}
        renderEnd={endButton}
      />
    );
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-agreements.agreements.closeEdit">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-agreement-form-button"
              onClick={this.props.handlers.onClose}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  render() {
    const { form, initialValues: { id, name } } = this.props;

    const hasLoaded = form.getRegisteredFields().length > 0;

    return (
      <Paneset>
        <FormattedMessage id="ui-agreements.create">
          {create => (
            <Pane
              appIcon={<AppIcon app="agreements" />}
              defaultWidth="100%"
              footer={this.renderPaneFooter()}
              id="pane-agreement-form"
              firstMenu={this.renderFirstMenu()}
              paneTitle={id ? name : <FormattedMessage id="ui-agreements.agreements.createAgreement" />}
            >
              <TitleManager record={id ? name : create}>
                <form id="form-agreement">
                  <div className={css.agreementForm}>
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
                      <FormSupplementaryInfo {...this.getSectionProps('formSupplementaryInfo')} />
                      <FormUsageData {...this.getSectionProps('formUsageProviders')} />
                    </AccordionSet>
                  </div>
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
