import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, isEqual } from 'lodash';
import stripesForm from '@folio/stripes/form';
import { Button, IconButton, Pane, PaneMenu } from '@folio/stripes/components';

import AgreementForm from '../AgreementForm';

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

  static defaultProps = {
    initialValues: {},
  }

  state = {
    addedResourcesFromBasket: [],
  }

  componentDidMount() {
    this.updateAddedResourcesFromBasket();
  }

  componentDidUpdate(prevProps, prevState) {
    // If we've stayed mounted but now have to handle a newly-added `addFromBasket` query param,
    // update the added resources from the basket.
    if (get(this.props.parentResources, ['query', 'addFromBasket']) && !get(prevProps.parentResources, ['query', 'addFromBasket'])) {
      this.updateAddedResourcesFromBasket();
    }

    // The value of the `items` field can be fed by the basket or if we're _editing_, the
    // previously-persisted values. We need to merge these two arrays when we get those data changes.
    const externalAgreementLine = get(this.props.parentResources.externalAgreementLine, ['records', 0]);
    if (
      !isEqual(this.props.initialValues, prevProps.initialValues) ||
      !isEqual(this.state.addedResourcesFromBasket, prevState.addedResourcesFromBasket) ||
      !isEqual(externalAgreementLine, get(prevProps.parentResources.externalAgreementLine, ['records', 0]))
    ) {
      const items = [
        ...get(this.props, ['initialValues', 'items'], []),
        ...this.state.addedResourcesFromBasket,
      ];

      if (externalAgreementLine) {
        items.push(externalAgreementLine);
      }

      this.props.change('items', items);
    }
  }

  componentWillUnmount() {
    this.props.parentMutator.query.update({
      addFromBasket: null,
      authority: null,
      referenceId: null,
    });
  }

  updateAddedResourcesFromBasket() {
    const { parentResources: { query, basket } } = this.props;

    if (query.addFromBasket) {
      // Get the indices of the basket items we're supposed to add
      const indices = query.addFromBasket.split(',');

      if (indices.length) {
        // Construct the _entitlement_ from those resources in the basket.
        const addedResourcesFromBasket = indices
          .map(i => ({ resource: basket[parseInt(i, 10)] }))
          .filter(i => i.resource);

        // Save off the resource objects we're adding from the basket
        this.setState({ addedResourcesFromBasket });
      }
    }
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-agreements.agreements.closeNewAgreement">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-agreement-form-button"
              onClick={this.props.onCancel}
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
    let labelId;
    if (initialValues.id) {
      id = 'clickable-updateagreement';
      labelId = 'ui-agreements.agreements.updateAgreement';
    } else {
      id = 'clickable-createagreement';
      labelId = 'ui-agreements.agreements.createAgreement';
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
          <FormattedMessage id={labelId} />
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const { initialValues } = this.props;
    const paneTitle = initialValues.id ? initialValues.name : <FormattedMessage id="ui-agreements.agreements.createAgreement" />;

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
  onSubmit: handleSubmit,
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(EditAgreement);
