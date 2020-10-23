import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  KeyValue,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
  TextField
} from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import css from './PCIForm.css';


class PlatformForm extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getRegisteredFields: PropTypes.func.isRequired,
    }).isRequired,
    handlers: PropTypes.PropTypes.shape({
      isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
      onClose: PropTypes.func.isRequired,
    }),
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    values: PropTypes.object,
  }

  static defaultProps = {
    initialValues: {},
  }

  state = {
    sections: {
      pciFormCoverage: true,
    }
  }

  getSectionProps(id) {
    const { form, values = {} } = this.props;

    return {
      form,
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
    } = this.props;

    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-update-pci"
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
        <FormattedMessage id="ui-agreements.pci.closeEdit">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-pci-form-button"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  render() {
    const { form, handlers: { isSuppressFromDiscoveryEnabled }, values: { name } } = this.props;

    // const hasLoaded = form.getRegisteredFields().length > 0;

    return (
      <Paneset>
        <Pane
          appIcon={<AppIcon app="agreements" iconKey="platform" />}
          centerContent
          defaultWidth="100%"
          firstMenu={this.renderFirstMenu()}
          footer={this.renderPaneFooter()}
          id="pane-pci-form"
          paneTitle={<FormattedMessage id="ui-agreements.pci.editPci" values={{ name }} />}
        >
          <TitleManager record={name}>
            <form id="form-platform">
              <Row>
                <Col xs={3}>
                  <KeyValue label={<FormattedMessage id="ui-agreements.platform.name" />}>
                    <div data-test-platform-name>
                      {name}
                    </div>
                  </KeyValue>
                </Col>
                <Col xs={3}>
                  <Field
                    autoFocus
                    component={TextField}
                    id="edit-local-platform-code"
                    label={<FormattedMessage id="ui-agreements.platform.localPlatformCode" />}
                    maxLength={255}
                    name="localCode"
                  />
                </Col>
              </Row>
            </form>
          </TitleManager>
        </Pane>
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
  navigationCheck: true,
})(PlatformForm);
