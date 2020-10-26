import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
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

class PlatformForm extends React.Component {
  static propTypes = {
    handlers: PropTypes.PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    values: PropTypes.object,
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
            id="clickable-update-platform"
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
        <FormattedMessage id="ui-agreements.platform.closeEdit">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-platform-form-button"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  render() {
    const { values: { name } } = this.props;

    return (
      <Paneset>
        <Pane
          appIcon={<AppIcon app="agreements" iconKey="platform" />}
          centerContent
          defaultWidth="100%"
          firstMenu={this.renderFirstMenu()}
          footer={this.renderPaneFooter()}
          id="pane-platform-form"
          paneTitle={<FormattedMessage id="ui-agreements.platform.editPlatform" values={{ name }} />}
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
