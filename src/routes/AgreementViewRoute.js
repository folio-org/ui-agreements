import React from 'react';
import PropTypes from 'prop-types';
import { get, flatten, uniqBy } from 'lodash';
import compose from 'compose-function';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import { preventResourceRefresh, Tags } from '@folio/stripes-erm-components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/views/Agreement';
import { urls } from '../components/utilities';
import { errorTypes } from '../constants';

import { joinRelatedAgreements } from './utilities/processRelatedAgreements';

const RECORDS_PER_REQUEST = 100;
const RECORDS_INCREMENT = 1000;

class AgreementViewRoute extends React.Component {
  static manifest = Object.freeze({
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
      shouldRefresh: preventResourceRefresh({ 'agreement': ['DELETE'] }),
    },
    agreementLines: {
      type: 'okapi',
      path: 'erm/entitlements',
      params: {
        filters: 'owner=:{id}',
        sort: 'resource.name',
        stats: 'true',
      },
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST,
      records: 'results',
      recordsRequired: '%{agreementLinesCount}',
      shouldRefresh: preventResourceRefresh({ 'agreement': ['DELETE'] }),
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
      shouldRefresh: preventResourceRefresh({ 'agreement': ['DELETE'] }),
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
      permissionsRequired: 'organizations-storage.interfaces.collection.get',
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
      fetch: props => !!props.stripes.hasInterface('order-lines', '1.0'),
      records: 'poLines',
      throwErrors: false,
    },
    supplementaryProperties: {
      type: 'okapi',
      path: 'erm/custprops',
      shouldRefresh: preventResourceRefresh({ 'agreement': ['DELETE'] }),
    },
    terms: {
      type: 'okapi',
      path: 'licenses/custprops',
    },
    users: {
      type: 'okapi',
      path: 'users',
      perRequest: RECORDS_PER_REQUEST,
      params: (_q, _p, _r, _l, props) => {
        const query = get(props.resources, 'agreement.records[0].contacts', [])
          .filter(contact => contact.user)
          .map(contact => `id==${contact.user}`)
          .join(' or ');

        return query ? { query } : null;
      },
      fetch: props => !!props.stripes.hasInterface('users', '15.0'),
      permissionsRequired: 'users.collection.get',
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
      agreement: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
      }),
      agreementLinesCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      agreementEresourcesCount: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }),
      eresourcesFilterPath: PropTypes.shape({
        replace: PropTypes.func,
      }),
      interfaceRecord: PropTypes.shape({
        replace: PropTypes.func,
      }),
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

  static contextType = CalloutContext;

  downloadBlob = (name) => (
    blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  )

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
      eresources: this.getAgreementEresourcesRecords(),
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

  getAgreementEresourcesRecords = () => {
    const { resources, match } = this.props;
    const agreementEresourcesUrl = resources?.agreementEresources?.url ?? '';
    const isPending = resources?.agreementEresources?.isPending;
    // If a new agreement is selected or if the filter has changed return undefined
    if (agreementEresourcesUrl.indexOf(`${match.params.id}`) === -1 ||
      agreementEresourcesUrl.indexOf(`resources/${resources.eresourcesFilterPath}`) === -1) {
      return undefined;
    } else {
      // If adding an eresource via basket return records only after the isPending state turns false
      return isPending ? undefined : resources?.agreementEresources?.records;
    }
  }

  getRecord = (id, resourceType) => {
    return get(this.props.resources, `${resourceType}.records`, [])
      .find(i => i.id === id);
  }

  handleClone = (cloneableProperties) => {
    const { history, location, match, stripes: { okapi } } = this.props;

    return fetch(`${okapi.url}/erm/sas/${match.params.id}/clone`, {
      method: 'POST',
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cloneableProperties),
    }).then(response => {
      if (response.ok) {
        return response.text(); // Parse it as text
      } else {
        throw new Error(errorTypes.JSON_ERROR);
      }
    }).then(text => {
      const data = JSON.parse(text); // Try to parse it as json
      if (data.id) {
        return Promise.resolve(history.push(`${urls.agreementEdit(data.id)}${location.search}`));
      } else {
        throw new Error(errorTypes.INVALID_JSON_ERROR); // when the json response body doesn't contain an id
      }
    }).catch(error => {
      throw error;
    });
  }

  handleClose = () => {
    this.props.history.push(`${urls.agreements()}${this.props.location.search}`);
  }

  handleDelete = () => {
    const { sendCallout } = this.context;
    const { history, location, mutator } = this.props;
    const agreement = this.getCompositeAgreement();

    if (agreement.items?.length) {
      sendCallout({ type: 'error', timeout: 0, message: <SafeHTMLMessage id="ui-agreements.errors.noDeleteHasAgreementLines" /> });
      return;
    }

    if (agreement.linkedLicenses?.length) {
      sendCallout({ type: 'error', timeout: 0, message: <SafeHTMLMessage id="ui-agreements.errors.noDeleteHasLicenses" /> });
      return;
    }

    if (agreement.relatedAgreements?.length) {
      sendCallout({ type: 'error', timeout: 0, message: <SafeHTMLMessage id="ui-agreements.errors.noDeleteHasRelatedAgreements" /> });
      return;
    }

    mutator.agreement.DELETE(agreement)
      .then(() => {
        history.push(`${urls.agreements()}${location.search}`);
        sendCallout({ message: <SafeHTMLMessage id="ui-agreements.agreements.deletedAgreement" values={{ name : agreement.name }} /> });
      })
      .catch(error => {
        sendCallout({ type: 'error', timeout: 0, message: <SafeHTMLMessage id="ui-agreements.errors.noDeleteAgreementBackendError" values={{ message: error.message }} /> });
      });
  }

  handleFilterEResources = (path) => {
    const { mutator } = this.props;
    mutator.eresourcesFilterPath.replace(path);
  }

  handleEdit = () => {
    const { history, location, match } = this.props;
    history.push(`${urls.agreementEdit(match.params.id)}${location.search}`);
  }

  handleExportAgreement = () => {
    const { resources, stripes: { okapi } } = this.props;
    const { id, name } = get(resources, 'agreement.records[0]', {});

    return fetch(`${okapi.url}/erm/sas/${id}/export/current`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then(response => response.blob())
      .then(this.downloadBlob(name));
  }

  handleExportEResourcesAsJSON = () => {
    const { resources, stripes: { okapi } } = this.props;
    const { id, name } = get(resources, 'agreement.records[0]', {});

    return fetch(`${okapi.url}/erm/sas/${id}/resources/export/${resources.eresourcesFilterPath}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then(response => response.blob())
      .then(this.downloadBlob(name));
  }

  handleExportEResourcesAsKBART = () => {
    const { resources, stripes: { okapi } } = this.props;
    const { id, name } = get(resources, 'agreement.records[0]', {});

    return fetch(`${okapi.url}/erm/sas/${id}/resources/export/${resources.eresourcesFilterPath}/kbart`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then(response => response.blob())
      .then(this.downloadBlob(name));
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

  handleViewAgreementLine = (lineId) => {
    const { history, location, match } = this.props;
    history.push(`${urls.agreementLineView(match.params.id, lineId)}${location.search}`);
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
        key={get(resources, 'agreement.loadedAt', 'loading')}
        data={{
          agreement: this.getCompositeAgreement(),
          eresourcesFilterPath: this.props.resources.eresourcesFilterPath,
          searchString: this.props.location.search,
          supplementaryProperties: get(resources, 'supplementaryProperties.records', []),
          terms: get(resources, 'terms.records', []),
        }}
        handlers={{
          ...handlers,
          onClone: this.handleClone,
          onClose: this.handleClose,
          onDelete: this.handleDelete,
          onEdit: this.handleEdit,
          onExportAgreement: this.handleExportAgreement,
          onExportEResourcesAsJSON: this.handleExportEResourcesAsJSON,
          onExportEResourcesAsKBART: this.handleExportEResourcesAsKBART,
          onFetchCredentials: this.handleFetchCredentials,
          onFilterEResources: this.handleFilterEResources,
          onNeedMoreEResources: this.handleNeedMoreEResources,
          onNeedMoreLines: this.handleNeedMoreLines,
          onToggleTags: tagsEnabled ? this.handleToggleTags : undefined,
          onViewAgreementLine: this.handleViewAgreementLine,
        }}
        helperApp={this.getHelperApp()}
        isLoading={this.isLoading()}
      />
    );
  }
}

export default compose(
  withFileHandlers,
  stripesConnect,
  withTags,
)(AgreementViewRoute);
