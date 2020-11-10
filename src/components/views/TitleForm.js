import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import {
  Button,
  Checkbox,
  Col,
  HasCommand,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { checkScope } from '@folio/stripes-erm-components';

import TitleCardInfo from '../TitleCard/TitleCardInfo';
import css from '../styles.css';

class TitleForm extends React.Component {
  static propTypes = {
    eresource: PropTypes.object,
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

  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();
  }

  getSectionProps(id) {
    const { form, values = {} } = this.props;

    return {
      form,
      id,
      values,
    };
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
    } = this.props;

    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-update-title"
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
        <FormattedMessage id="ui-agreements.title.closeEdit">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-title-form-button"
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
  ];

  render() {
    const { handlers: { isSuppressFromDiscoveryEnabled }, values: { name } } = this.props;

    return (
      <HasCommand
        commands={this.shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            centerContent
            defaultWidth="100%"
            firstMenu={this.renderFirstMenu()}
            footer={this.renderPaneFooter()}
            id="pane-title-form"
            paneTitle={<FormattedMessage id="ui-agreements.editResource" values={{ name }} />}
          >
            <TitleManager record={name}>
              <form id="form-title">
                <TitleCardInfo {...this.getSectionProps('info')} title={this.props.eresource} />
                <div className={css.separator} />
                { isSuppressFromDiscoveryEnabled('title') ?
                  <Col xs={3}>
                    <Field
                      component={Checkbox}
                      id="pci-suppress-from-discovery"
                      label={<FormattedMessage id="ui-agreements.eresources.suppressFromDiscovery" />}
                      name="suppressFromDiscovery"
                      type="checkbox"
                      vertical
                    />
                  </Col> : null
            }
              </form>
            </TitleManager>
          </Pane>
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
  navigationCheck: true,
})(TitleForm);
