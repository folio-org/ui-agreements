import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { useStripes } from '@folio/stripes/core';

import {
  Button,
  Checkbox,
  Layout,
  List,
  Pane,
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

import { HideAccordions, MCLPaginationFields, SuppressFromDiscoveryFields } from './components';

const GeneralSettingsForm = ({
  handleSubmit,
  label,
  pristine,
  submitting
}) => {
  const stripes = useStripes();
  const disabled = !stripes.hasPerm('ui-agreements.generalSettings.manage');

  const getLastMenu = () => {
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
  };

  return (
    <form id="agreement-general-settings-form" onSubmit={handleSubmit}>
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        id="pane-agreements-settings-general"
        lastMenu={getLastMenu()}
        paneTitle={label}
      >
        <Field
          component={Checkbox}
          disabled={disabled}
          id="hideEResourcesFunctionality"
          label={<FormattedMessage id="ui-agreements.settings.general.hideEResourcesFunctionality.title" />}
          name="hideEResourcesFunctionality"
          type="checkbox"
        />
        <Layout className="padding-bottom-gutter padding-top-gutter">
          <FormattedMessage id="ui-agreements.settings.general.hideEResourcesFunctionality.description" />
        </Layout>
        <Layout className="margin-both-gutter">
          <List
            itemFormatter={item => <FormattedMessage key={`hideEResources.result.${item}`} id={`ui-agreements.settings.hideEResources.result.${item}`} tagName="li" />}
            items={[1, 2, 3]}
            listStyle="bullets"
          />
        </Layout>
        <MCLPaginationFields />
        <SuppressFromDiscoveryFields name="displaySuppressFromDiscovery" />
        <HideAccordions name="hideAccordions" />
      </Pane>
    </form>
  );
};

GeneralSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element
  ]),
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func
  }),
};


export default stripesFinalForm({
  navigationCheck: true,
  enableReinitialize: true,
  subscription: {
    values: true,
  },
})(GeneralSettingsForm);
