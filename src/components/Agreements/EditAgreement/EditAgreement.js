import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stripesForm from '@folio/stripes/form';
import { Button, IconButton, Pane, PaneMenu } from '@folio/stripes/components';

import AgreementForm from '../AgreementForm';

const validate = (values) => {
  const required = ['name', 'startDate', 'agreementStatus'];
  const errors = {};

  required.forEach((key) => {
    if (!values[key]) {
      errors[key] = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }
  });

  return errors;
};

const handleSubmit = (agreement, dispatch, props) => {
  props.onUpdate(agreement)
    .then(() => props.onCancel());
};

class EditAgreement extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          icon="closeX"
          onClick={this.props.onCancel}
          aria-label={this.props.stripes.intl.formatMessage({ id: 'ui-erm.agreements.closeNewAgreement' })}
        />
      </PaneMenu>
    );
  }

  renderLastMenu() {
    const { initialValues, stripes: { intl } } = this.props;

    let id;
    let label;
    if (initialValues && initialValues.id) {
      id = 'clickable-updateagreement';
      label = intl.formatMessage({ id: 'ui-erm.agreements.updateAgreement' });
    } else {
      id = 'clickable-createagreement';
      label = intl.formatMessage({ id: 'ui-erm.agreements.createAgreement' });
    }

    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          title={label}
          ariaLabel={label}
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
    const { initialValues, stripes: { intl } } = this.props;
    const paneTitle = initialValues && initialValues.id ?
      initialValues.name : intl.formatMessage({ id: 'ui-erm.agreements.createAgreement' });

    return (
      <form id="form-agreement">
        <Pane
          defaultWidth="100%"
          firstMenu={this.renderFirstMenu()}
          lastMenu={this.renderLastMenu()}
          paneTitle={paneTitle}
        >
          <AgreementForm {...this.props} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'EditAgreement',
  validate,
  onSubmit: handleSubmit,
  navigationCheck: true,
  enableReinitialize: true,
})(EditAgreement);
