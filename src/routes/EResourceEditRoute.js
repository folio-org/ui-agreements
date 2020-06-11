import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import View from '../components/views/PCIForm';
import NoPermissions from '../components/NoPermissions';
import { urls } from '../components/utilities';

class EResourceEditRoute extends React.Component {
  static manifest = Object.freeze({
    pci: {
      type: 'okapi',
      path: 'erm/pci/:{id}',
      shouldRefresh: () => false,
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      pci: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      pci: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-agreements.resources.edit'),
    };
  }

  getInitialValues = () => {
    const { resources } = this.props;
    const pci = resources?.pci?.records?.[0] ?? {};
    const initialValues = cloneDeep(pci);
    return initialValues;
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.eresourceView(match.params.id)}${location.search}`);
  }

  handleSubmit = (pci) => {
    const { history, location, mutator } = this.props;
    const { coverage, id, suppressFromDiscovery } = pci;

    return mutator.pci
      .PUT({
        id,
        coverage,
        suppressFromDiscovery
      })
      .then(({ pciId }) => {
        history.push(`${urls.eresourceView(pciId)}${location.search}`);
      });
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'pci')
      .some(r => r.isPending);
  }

  render() {
    if (!this.state.hasPerms) return <NoPermissions />;
    if (this.fetchIsPending()) return <LoadingView dismissible onClose={this.handleClose} />;

    return (
      <View
        handlers={{
          onClose: this.handleClose,
        }}
        initialValues={this.getInitialValues()}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(EResourceEditRoute);
