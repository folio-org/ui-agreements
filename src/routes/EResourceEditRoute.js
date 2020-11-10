import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import { checkScope, collapseAllSections, expandAllSections } from '@folio/stripes-erm-components';
import PCIForm from '../components/views/PCIForm';
import TitleForm from '../components/views/TitleForm';
import NoPermissions from '../components/NoPermissions';
import { urls, withSuppressFromDiscovery } from '../components/utilities';
import { resourceClasses } from '../constants';

class EResourceEditRoute extends React.Component {
  static manifest = Object.freeze({
    resource: {
      type: 'okapi',
      path: 'erm/resource/:{id}',
      shouldRefresh: () => false,
    },
    pci: {
      type: 'okapi',
      path: 'erm/pci/:{id}',
      fetch: false
    },
    title: {
      type: 'okapi',
      path: 'erm/titles/:{id}',
      fetch: false
    },
  });

  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
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
      title: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      resource: PropTypes.object,
      settings: PropTypes.object,
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
    const resource = resources?.resource?.records?.[0] ?? {};
    const initialValues = cloneDeep(resource);
    return initialValues;
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.eresourceView(match.params.id)}${location.search}`);
  }

  handlePCISubmit = (pci) => {
    const { history, location, mutator } = this.props;
    const { coverage, id, suppressFromDiscovery } = pci;

    return mutator.pci
      .PUT({
        id,
        coverage,
        suppressFromDiscovery
      })
      .then(() => {
        history.push(`${urls.eresourceView(id)}${location.search}`);
      });
  }

  handleTitleSubmit = (title) => {
    const { history, location, mutator } = this.props;
    const { id, suppressFromDiscovery } = title;

    return mutator.title
      .PUT({
        id,
        suppressFromDiscovery
      })
      .then(() => {
        history.push(`${urls.eresourceView(id)}${location.search}`);
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
    const { isSuppressFromDiscoveryEnabled } = this.props;
    const eresource = this.props.resources?.resource?.records[0];
    const eresourceClass = eresource?.class

    const EResourceViewComponent = eresourceClass === resourceClasses.TITLEINSTANCE ? TitleForm : PCIForm;
    console.log(eresourceClass);

    return (
      <EResourceViewComponent
        eresource={eresource}
        handlers={{
          ...this.props.handlers,
          checkScope,
          collapseAllSections,
          expandAllSections,
          isSuppressFromDiscoveryEnabled,
          onClose: this.handleClose,
        }}
        initialValues={this.getInitialValues()}
        onSubmit={eresourceClass === resourceClasses.TITLEINSTANCE ? this.handleTitleSubmit : this.handlePCISubmit}
      />
    );
  }
}

export default compose(
  stripesConnect,
  withSuppressFromDiscovery
)(EResourceEditRoute);
