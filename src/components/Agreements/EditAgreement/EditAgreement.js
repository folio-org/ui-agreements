import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import stripesForm from '@folio/stripes-form';
import { Button, IconButton, Pane, PaneMenu } from '@folio/stripes-components/lib/Pane';

import AgreementForm from '../AgreementForm';

class AgreementPane extends Component {
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

  constructor(props) {
    super(props);
    this.deleteAgreement = this.deleteAgreement.bind(this);
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
    const { stripes: { intl } } = this.props;

    let id;
    let label;
    if (this.props.initialValues.id) {
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

  deleteAgreement = (id) => {
    const { parentMutator } = this.props;

    parentMutator.records.DELETE({ id }).then(() => {
      parentMutator.query.update({
        _path: '/erm/sas',
        layer: null
      });
    });
  }

  render() {
    const { initialValues, stripes: { intl } } = this.props;
    const paneTitle = initialValues.id ? initialValues.name : intl.formatMessage({ id: 'ui-erm.agreements.createAgreement' });

    return (
      <form id="form-agreement">
        <Pane
          defaultWidth="100%"
          firstMenu={this.renderFirstMenu}
          lastMenu={this.renderLastMenu}
          paneTitle={paneTitle}
        >
          <AgreementForm {...this.props} deleteAgreement={this.deleteAgreement} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'AgreementPane',
  // validate,
  // asyncValidate,
  navigationCheck: true,
  enableReinitialize: true,
})(AgreementPane);
