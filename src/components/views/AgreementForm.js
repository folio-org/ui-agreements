import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Layout,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import { Spinner } from '@folio/stripes-erm-components';

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
    change: PropTypes.func,
    data: PropTypes.shape({
      agreementLines: PropTypes.array.isRequired,
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
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    sections: {
      formInternalContacts: true,
      formLines: true,
      formLicenses: true,
      formOrganizations: true,
      formSupplementaryInfo: true,
      formUsageProviders: true,
    }
  }

  componentDidUpdate(prevProps) {
    const {
      data: { agreementLinesToAdd: prevAgreementLinesToAdd },
      initialValues: prevInitialValues,
    } = prevProps;
    const {
      data: { agreementLinesToAdd: currAgreementLinesToAdd },
      initialValues: currInitialValues,
    } = this.props;

    if (
      !isEqual(currInitialValues, prevInitialValues) ||
      !isEqual(prevAgreementLinesToAdd, currAgreementLinesToAdd)
    ) {
      this.props.change('items', [
        ...(currInitialValues.items || []),
        ...currAgreementLinesToAdd,
      ]);
    }
  }

  getSectionProps(id) {
    const { data, handlers } = this.props;

    return {
      data,
      handlers,
      id,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
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

  renderLoadingPane = () => {
    return (
      <Paneset>
        <Pane
          dismissible
          defaultWidth="100%"
          id="pane-agreement-form"
          onClose={this.props.handlers.onClose}
          paneTitle={<FormattedMessage id="ui-agreements.loading" />}
        >
          <Layout className="marginTop1">
            <Spinner />
          </Layout>
        </Pane>
      </Paneset>
    );
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
    const { initialValues: { id, name }, isLoading, statusValue} = this.props;
    if (isLoading) return this.renderLoadingPane();

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

export default stripesForm({
  form: 'EditAgreement',
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(AgreementForm);
