import React from 'react';
import PropTypes from 'prop-types';
import { get, flatten, uniqBy } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import { Tags } from '@folio/stripes-erm-components';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/views/Agreement';
import { urls } from '../components/utilities';

import { joinRelatedAgreements } from './utilities/processRelatedAgreements';

const RECORDS_PER_REQUEST = 100;
const RECORDS_INCREMENT = 1000;

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
        stats: 'true',
        term: ':{id}',
      },
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST,
      records: 'results',
      recordsRequired: '%{agreementLinesCount}',
    },
    agreementEresources: {
      type: 'okapi',
      path: 'erm/sas/:{id}/resources/%{eresourcesFilterPath}',
      params: {
        sort: 'pti.titleInstance.name;asc',
        stats: 'true',
      },
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST,
      records: 'results',
      recordsRequired: '%{agreementEresourcesCount}',
    },
    cloneAgreement: {
      type: 'okapi',
      POST: {
        path: 'erm/sas/:{id}/clone',
      },
      clientGeneratePk: false,
      fetch: false,
    },
    eresourcesFilterPath: { initialValue: 'current' },
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
      fetch: props => !!props.stripes.hasInterface('organizations-storage.interfaces', '2.0'),
      records: 'interfaces',
    },
    orderLines: {
      type: 'okapi',
      path: 'orders/order-lines',
      params: (_q, _p, _r, _l, props) => {
        const query = get(props.resources, 'agreementLines.records', [])
          .filter(line => line.poLines && line.poLines.length)
          .map(line => (line.poLines
            .map(poLine => `id==${poLine.poLineId}`)
            .join(' or ')
          ))
          .join(' or ');

        return query ? { query } : null;
      },
      fetch: props => !!props.stripes.hasInterface('orders', '6.0 7.0 8.0'),
      records: 'poLines',
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
      throwErrors: false,
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
    agreementLinesCount: { initialValue: RECORDS_PER_REQUEST },
    agreementEresourcesCount: { initialValue: RECORDS_PER_REQUEST },
    interfacesCredentials: {
      clientGeneratePk: false,
      throwErrors: false,
      path: 'organizations-storage/interfaces/%{interfaceRecord.id}/credentials',
      type: 'okapi',
      pk: 'FAKE_PK',  // it's done to fool stripes-connect not to add cred id to the path's end.
      permissionsRequired: 'organizations-storage.interfaces.credentials.item.get',
      fetch: props => !!props.stripes.hasInterface('organizations-storage.interfaces', '1.0 2.0'),
    },
    interfaceRecord: {},
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
      agreementLinesCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      agreementEresourcesCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      cloneAgreement: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      agreement: PropTypes.object,
      agreementLines: PropTypes.object,
      agreementLinesCount: PropTypes.number,
      agreementEresources: PropTypes.object,
      agreementEresourcesCount: PropTypes.number,
      eresourcesFilterPath: PropTypes.string,
      interfaces: PropTypes.object,
      orderLines: PropTypes.object,
      query: PropTypes.object,
      users: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasInterface: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.shape({
        tenant: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
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

    const interfacesCredentials = uniqBy(get(resources, 'interfacesCredentials.records', []), 'id');

    const orgs = agreement.orgs.map(o => ({
      ...o,
      interfaces: get(o, 'org.orgsUuid_object.interfaces', [])
        .map(id => ({
          ...this.getRecord(id, 'interfaces') || {},
          credentials: interfacesCredentials.find(cred => cred.interfaceId === id)
        })),
    }));

    joinRelatedAgreements(agreement);

    return {
      ...agreement,
      contacts,
      eresources: get(resources, 'agreementEresources.records'),
      eresourcesCount: get(resources, 'agreementEresources.other.totalRecords'),
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

  handleClone = (cloneableProperties) => {
    const { history, location, mutator } = this.props;

    mutator.cloneAgreement
      .POST(cloneableProperties)
      .then(({ id }) => {
        history.push(`${urls.agreementEdit(id)}${location.search}`);
      });
  }

  handleClose = () => {
    this.props.history.push(`${urls.agreements()}${this.props.location.search}`);
  }

  handleFilterEResources = (path) => {
    const { mutator } = this.props;
    mutator.eresourcesFilterPath.replace(path);
  }

  handleEdit = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.agreementEdit(match.params.id)}${location.search}`);
  }

  handleExportEResourcesAsJSON = () => {
    const { resources, stripes: { okapi } } = this.props;
    const { id, name } = get(resources, 'agreement.records[0]', {});

    return fetch(`${okapi.url}/erm/sas/${id}/export/${resources.eresourcesFilterPath}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  handleExportEResourcesAsKBART = () => {
    const { resources, stripes: { okapi } } = this.props;
    const { id, name } = get(resources, 'agreement.records[0]', {});

    return fetch(`${okapi.url}/erm/sas/${id}/export/${resources.eresourcesFilterPath}/kbart`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  handleNeedMoreLines = () => {
    const { agreementLinesCount } = this.props.resources;
    this.props.mutator.agreementLinesCount.replace(agreementLinesCount + RECORDS_INCREMENT);
  }

  handleFetchCredentials = (id) => {
    const { mutator } = this.props;
    mutator.interfaceRecord.replace({ id });
  }

  handleNeedMoreEResources = () => {
    const { agreementEresourcesCount } = this.props.resources;
    this.props.mutator.agreementEresourcesCount.replace(agreementEresourcesCount + RECORDS_INCREMENT);
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
          eresourcesFilterPath: this.props.resources.eresourcesFilterPath,
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          ...handlers,
          onFilterEResources: this.handleFilterEResources,
          onClose: this.handleClose,
          onClone: this.handleClone,
          onEdit: this.handleEdit,
          onExportEResourcesAsJSON: this.handleExportEResourcesAsJSON,
          onExportEResourcesAsKBART: this.handleExportEResourcesAsKBART,
          onFetchCredentials: this.handleFetchCredentials,
          onNeedMoreEResources: this.handleNeedMoreEResources,
          onNeedMoreLines: this.handleNeedMoreLines,
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
