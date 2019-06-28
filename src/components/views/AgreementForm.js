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
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    sections: {
      formInternalContacts: false,
      formLines: false,
      formLicenses: false,
      formOrganizations: false,
      formSupplementaryInfo: false,
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

  renderLastMenu() {
    const { initialValues } = this.props;

    let id;
    let label;
    if (initialValues && initialValues.id) {
      id = 'clickable-update-agreement';
      label = <FormattedMessage id="ui-agreements.agreements.updateAgreement" />;
    } else {
      id = 'clickable-create-agreement';
      label = <FormattedMessage id="ui-agreements.agreements.createAgreement" />;
    }

    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          disabled={this.props.pristine || this.props.submitting}
          onClick={this.props.handleSubmit}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const { initialValues: { id, name }, isLoading } = this.props;

    if (isLoading) return this.renderLoadingPane();

    return (
      <Paneset>
        <FormattedMessage id="ui-agreements.create">
          {create => (
            <Pane
              appIcon={<AppIcon app="agreements" />}
              defaultWidth="100%"
              id="pane-agreement-form"
              firstMenu={this.renderFirstMenu()}
              lastMenu={this.renderLastMenu()}
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
