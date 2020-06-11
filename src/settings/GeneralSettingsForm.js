import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Checkbox,
  Layout,
  List,
  Pane,
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
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          id="pane-agreements-settings-general"
          lastMenu={this.getLastMenu()}
          paneTitle={label}
        >
          <Field
            component={Checkbox}
            id="hideEResourcesFunctionality"
            label={<FormattedMessage id="ui-agreements.settings.general.hideEResourcesFunctionality.title" />}
            name="hideEResourcesFunctionality"
            normalize={v => !!v}
            type="checkbox"
          />
          <Layout className="padding-bottom-gutter padding-top-gutter">
            <FormattedMessage id="ui-agreements.settings.general.hideEResourcesFunctionality.description" />
          </Layout>
          <Layout className="margin-both-gutter">
            <List
              itemFormatter={item => <FormattedMessage id={`ui-agreements.settings.hideEResources.result.${item}`} tagName="li" />}
              items={[1, 2, 3]}
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
