import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Checkbox,
  Col,
  Layout,
  List,
  Pane,
  Row
} from '@folio/stripes/components';


import stripesForm from '@folio/stripes/form';

class GeneralSettingsForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    label: PropTypes.string,
  };

  handleSave = (data) => {
    const { loadedConfig = {}, ...rest } = data;

    this.props.onSubmit({
      general: JSON.stringify({
        ...loadedConfig,
        ...rest,
      })
    });
  }

  getLastMenu = () => {
    const { pristine, submitting } = this.props;

    return (
      <Button
        buttonStyle="primary"
        disabled={(pristine || submitting)}
        id="clickable-save-agreements-general-settings"
        marginBottom0
        type="submit"
      >
        <FormattedMessage id="stripes-core.button.save" />
      </Button>
    );
  }

  render() {
    const {
      handleSubmit,
      label,
    } = this.props;

    return (
      <form id="agreement-general-settings-form" onSubmit={handleSubmit(this.handleSave)}>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle={label} lastMenu={this.getLastMenu()}>
          <Row>
            <Col xs={12}>
              <Field
                label={<FormattedMessage id="ui-agreements.settings.general.hideEResourcesFunctionality.title" />}
                id="hideEResourcesFunctionality"
                name="hideEResourcesFunctionality"
                component={Checkbox}
                type="checkbox"
                normalize={v => !!v}
              />
            </Col>
          </Row>
          <Layout className="padding-bottom-gutter padding-top-gutter">
            <FormattedMessage id="ui-agreements.settings.general.hideEResourcesFunctionality.description" />
          </Layout>
          <Layout className="margin-both-gutter">
            <List
              items={[1, 2, 3]}
              itemFormatter={item => <FormattedMessage id={`ui-agreements.settings.hideEResources.result.${item}`} tagName="li" />}
              listStyle="bullets"
            />
          </Layout>
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'agreementGeneralSettingsForm',
  navigationCheck: true,
  enableReinitialize: true,
})(GeneralSettingsForm);
