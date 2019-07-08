import React from 'react';
import PropTypes from 'prop-types';
import { get, flatten } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import { Tags } from '@folio/stripes-erm-components';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/views/Agreement';
import { urls } from '../components/utilities';

const ERESOURCES_RESULTS_INTERVAL = 100;

class AgreementViewRoute extends React.Component {
  static manifest = Object.freeze({
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}'
    },
    agreementLines: {
      type: 'okapi',
      path: 'erm/entitlements',
      params: {
        match: 'owner.id',
        term: ':{id}',
      },
    },
    agreementEresources: {
      type: 'okapi',
      path: 'erm/sas/:{id}/resources',
      params: {
        stats: 'true',
        sort: 'pti.titleInstance.name;asc',
      },
      records: 'results',
      recordsRequired: '%{agreementEresourcesCount}',
      perRequest: ERESOURCES_RESULTS_INTERVAL,
      limitParam: 'perPage',
    },
    interfaces: {
      type: 'okapi',
      path: 'organizations-storage/interfaces',
      params: (_q, _p, _r, _l, props) => {
        const orgs = get(props.resources, 'agreement.records[0].orgs', []);
        const interfaces = flatten(orgs.map(o => get(o, 'org.orgsUuid_object.interfaces', [])));
        const query = [
          ...new Set(interfaces.map(i => `id==${i}`))
        ].join(' or ');

        return query ? { query } : null;
      },
      fetch: props => !!props.stripes.hasInterface('organizations-storage.interfaces', '1.0'),
      records: 'interfaces',
    },
    orderLines: {
      type: 'okapi',
      path: 'orders/order-lines',
      params: (_q, _p, _r, _l, props) => {
        const query = get(props.resources, 'agreementLines.records', [])
          .filter(line => line.poLineId)
          .map(line => `id==${line.poLineId}`)
          .join(' or ');

        return query ? { query } : null;
      },
      fetch: props => !!props.stripes.hasInterface('orders', '6.0'),
      records: 'poLines',
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
    },
    users: {
      type: 'okapi',
      path: 'users',
      params: (_q, _p, _r, _l, props) => {
        const query = get(props.resources, 'agreement.records[0].contacts', [])
          .filter(contact => contact.user)
          .map(contact => `id==${contact.user}`)
          .join(' or ');

        return query ? { query } : null;
      },
      fetch: props => !!props.stripes.hasInterface('users', '15.0'),
      records: 'users',
    },
    agreementEresourcesCount: { initialValue: ERESOURCES_RESULTS_INTERVAL },
    query: {},
  });

  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired
    }).isRequired,
    mutator: PropTypes.shape({
      agreementEresourcesCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      agreement: PropTypes.object,
      agreementLines: PropTypes.object,
      agreementEresources: PropTypes.object,
      agreementEresourcesCount: PropTypes.number,
      interfaces: PropTypes.object,
      orderLines: PropTypes.object,
      query: PropTypes.object,
      users: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasInterface: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    tagsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    handlers: {},
  }

  getCompositeAgreement = () => {
    const { resources } = this.props;
    const agreement = get(resources, 'agreement.records[0]', {
      contacts: [],
      orgs: [],
    });

    const contacts = agreement.contacts.map(c => ({
      ...c,
      user: this.getRecord(c.user, 'users') || c.user,
    }));

    const orgs = agreement.orgs.map(o => ({
      ...o,
      interfaces: get(o, 'org.orgsUuid_object.interfaces', [])
        .map(id => this.getRecord(id, 'interfaces') || id)
    }));

    return {
      ...agreement,
      contacts,
      eresources: get(resources, 'agreementEresources.records'),
      lines: get(resources, 'agreementLines.records'),
      orderLines: get(resources, 'orderLines.records'),
      orgs,
    };
  }

  getHelperApp = () => {
    const { match, resources } = this.props;
    const helper = resources.query.helper;
    if (!helper) return null;

    let HelperComponent = null;

    if (helper === 'tags') HelperComponent = Tags;

    if (!HelperComponent) return null;

    return (
      <HelperComponent
        link={`erm/sas/${match.params.id}`}
        onToggle={() => this.handleToggleHelper(helper)}
      />
    );
  }

  getRecord = (id, resourceType) => {
    return get(this.props.resources, `${resourceType}.records`, [])
      .find(i => i.id === id);
  }

  handleClose = () => {
    this.props.history.push(`${urls.agreements()}${this.props.location.search}`);
  }

  handleEdit = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.agreementEdit(match.params.id)}${location.search}`);
  }

  handleNeedMoreEResources = () => {
    const { agreementEresourcesCount } = this.props.resources;
    this.props.mutator.agreementEresourcesCount.replace(agreementEresourcesCount + ERESOURCES_RESULTS_INTERVAL);
  }

  handleToggleHelper = (helper) => {
    const { mutator, resources } = this.props;
    const currentHelper = resources.query.helper;
    const nextHelper = currentHelper !== helper ? helper : null;

    mutator.query.update({ helper: nextHelper });
  }

  handleToggleTags = () => {
    this.handleToggleHelper('tags');
  }

  isLoading = () => {
    const { match, resources } = this.props;

    return (
      match.params.id !== get(resources, 'agreement.records[0].id') &&
      get(resources, 'agreement.isPending', true)
    );
  }

  render() {
    const {
      handlers,
      resources,
      tagsEnabled,
    } = this.props;

    return (
      <View
        canEdit={this.props.stripes.hasPerm('ui-agreements.agreements.edit')}
        data={{
          agreement: this.getCompositeAgreement(),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
          onEdit: this.handleEdit,
          onNeedMoreEResources: this.handleNeedMoreEResources,
          onToggleTags: tagsEnabled ? this.handleToggleTags : undefined,
        }}
        helperApp={this.getHelperApp()}
        isLoading={this.isLoading()}
        key={get(resources, 'agreement.loadedAt', 'loading')}
      />
    );
  }
}

export default compose(
  withFileHandlers,
  stripesConnect,
  withTags,
)(AgreementViewRoute);
