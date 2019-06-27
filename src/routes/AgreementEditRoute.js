import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, difference, get, flatten } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/views/AgreementForm';
import NoPermissions from '../components/NoPermissions';
import { urls } from '../components/utilities';

class AgreementEditRoute extends React.Component {
  static manifest = Object.freeze({
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
      shouldRefresh: () => false,
    },
    agreementLines: {
      type: 'okapi',
      path: 'erm/entitlements',
      params: {
        match: 'owner.id',
        term: ':{id}',
      },
    },
    agreementStatusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/agreementStatus',
      shouldRefresh: () => false,
    },
    contactRoleValues: {
      type: 'okapi',
      path: 'erm/refdataValues/InternalContact/role',
      shouldRefresh: () => false,
    },
    externalAgreementLine: {
      type: 'okapi',
      path: 'erm/entitlements/external',
      shouldRefresh: () => false,
      params: {
        authority: '?{authority}',
        reference: '?{referenceId}',
      },
      throwErrors: false,
    },
    interfaces: {
      type: 'okapi',
      path: 'organizations-storage/interfaces',
      records: 'interfaces',
      accumulate: true,
      fetch: false,
      shouldRefresh: () => false,
    },
    isPerpetualValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/isPerpetual',
      shouldRefresh: () => false,
    },
    licenseLinkStatusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/RemoteLicenseLink/status',
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreementOrg/role',
      shouldRefresh: () => false,
    },
    renewalPriorityValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/renewalPriority',
      shouldRefresh: () => false,
    },
    users: {
      type: 'okapi',
      path: 'users',
      records: 'users',
      fetch: false,
      accumulate: true,
      shouldRefresh: () => false,
    },
    basket: { initialValue: [] },
    query: { initialValue: {} },
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
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      agreements: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
      query: PropTypes.shape({
        update: PropTypes.func.isRequired
      }).isRequired,
      interfaces: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }),
      users: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      agreement: PropTypes.object,
      interfaces: PropTypes.object,
      orgRoleValues: PropTypes.object,
      statusValues: PropTypes.object,
      terms: PropTypes.object,
      typeValues: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasInterface: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    handlers: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-agreements.agreements.edit'),
    };
  }

  componentDidMount() {
    const contacts = get(this.props.resources, 'agreement.records[0].contacts', []);
    if (contacts.length) {
      this.fetchUsers(contacts);
    }

    const orgs = get(this.props.resources, 'agreement.records[0].orgs', []);
    if (orgs.length) {
      this.fetchInterfaces(orgs);
    }
  }

  componentDidUpdate(prevProps) {
    const prevAgreement = get(prevProps.resources, 'agreement.records[0]', {});
    const currAgreement = get(this.props.resources, 'agreement.records[0]', {});
    const prevContacts = prevAgreement.contacts || [];
    const currContacts = currAgreement.contacts || [];
    const newContacts = difference(currContacts, prevContacts);
    const prevOrgs = prevAgreement.orgs || [];
    const currOrgs = currAgreement.orgs || [];
    const newOrgs = difference(currOrgs, prevOrgs);
    if (prevAgreement.id !== currAgreement.id || newContacts.length) {
      this.fetchUsers(newContacts);
    }
    if (prevAgreement.id !== currAgreement.id || newOrgs.length) {
      this.fetchInterfaces(newOrgs);
    }
  }

  componentWillUnmount() {
    this.props.mutator.query.update({
      addFromBasket: null,
      authority: null,
      referenceId: null,
    });
  }

  fetchUsers = (contacts) => {
    if (!this.props.stripes.hasInterface('users', '15.0')) return;

    const query = contacts.map(c => `id==${c.user}`).join(' or ');

    if (!query) return;
    this.props.mutator.users.GET({ params: { query } });
  }

  fetchInterfaces = (newOrgs) => {
    if (!this.props.stripes.hasInterface('organizations-storage.interfaces', '1.0')) return;
    const orgs = newOrgs || get(this.props.resources, 'agreement.records[0].orgs', []);
    const interfaces = flatten(orgs.map(o => get(o, 'org.orgsUuid_object.interfaces', [])));
    const query = [
      ...new Set(interfaces.map(i => `id==${i}`))
    ].join(' or ');

    if (!query) return;
    this.props.mutator.interfaces.GET({ params: { query } });
  }


  getInitialValues = () => {
    const { resources } = this.props;
    const agreement = get(resources, 'agreement.records[0]', {});
    const initialValues = cloneDeep(agreement);
    const {
      agreementStatus = {},
      contacts = [],
      isPerpetual = {},
      items = [],
      linkedLicenses = [],
      orgs = [],
      renewalPriority = {},
    } = initialValues;

    // Set the values of dropdown-controlled props as values rather than objects.
    initialValues.agreementStatus = agreementStatus.value;
    initialValues.isPerpetual = isPerpetual.value;
    initialValues.renewalPriority = renewalPriority.value;
    initialValues.contacts = contacts.map(c => ({ ...c, role: c.role.value }));
    initialValues.linkedLicenses = linkedLicenses.map(l => ({ ...l, status: l.status.value }));
    initialValues.orgs = orgs.map(o => ({ ...o, role: o.role && o.role.value }));

    const lines = get(resources, 'agreementLines.records', []);
    if (items.length && lines.length) {
      initialValues.items = items.map(item => {
        if (item.resource) return item;

        const line = lines.find(l => l.id === item.id);
        if (!line) return item;

        return {
          id: line.id,
          coverage: line.customCoverage ? line.coverage : undefined,
        };
      });
    }

    return initialValues;
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.agreementView(match.params.id)}${location.search}`);
  }

  handleSubmit = (agreement) => {
    const { history, location, mutator } = this.props;

    mutator.agreement
      .PUT(agreement)
      .then(({ id }) => {
        history.push(`${urls.agreementView(id)}${location.search}`);
      });
  }

  getAgreementLines = () => {
    return [
      ...get(this.props.resources, 'agreementLines.records', []),
      ...this.getAgreementLinesToAdd(),
    ];
  }

  getAgreementLinesToAdd = () => {
    const { resources } = this.props;
    const { query: { addFromBasket } } = resources;

    const externalAgreementLines = get(resources, 'externalAgreementLine.records', []);

    let basketLines = [];
    if (resources.query.addFromBasket) {
      const basket = get(resources, 'basket', []);

      basketLines = addFromBasket
        .split(',')
        .map(index => ({ resource: basket[parseInt(index, 10)] }))
        .filter(line => line.resource); // sanity check that there _was_ an item at that index
    }

    return [
      ...externalAgreementLines,
      ...basketLines,
    ];
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'agreements')
      .some(r => r.isPending);
  }

  getRecord = (id, resourceType) => {
    return get(this.props.resources, `${resourceType}.records`, [])
      .find(i => i.id === id);
  }

  getOrgs = () => {
    const { resources } = this.props;
    const agreement = get(resources, 'agreement.records[0]', {
      orgs: [],
    });

    const orgs = agreement.orgs.map(o => ({
      ...o,
      interfaces: get(o, 'org.orgsUuid_object.interfaces', [])
        .map(id => this.getRecord(id, 'interfaces') || id)
    }));

    return {
      orgs,
    };
  }

  render() {
    const { handlers, resources } = this.props;

    if (!this.state.hasPerms) return <NoPermissions />;

    return (
      <View
        data={{
          orgs: this.getOrgs(),
          agreementLines: this.getAgreementLines(),
          agreementLinesToAdd: this.getAgreementLinesToAdd(),
          agreementStatusValues: get(resources, 'agreementStatusValues.records', []),
          basket: get(resources, 'basket', []),
          contactRoleValues: get(resources, 'contactRoleValues.records', []),
          externalAgreementLine: get(resources, 'externalAgreementLine.records', []),
          isPerpetualValues: get(resources, 'isPerpetualValues.records', []),
          licenseLinkStatusValues: get(resources, 'licenseLinkStatusValues.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          renewalPriorityValues: get(resources, 'renewalPriorityValues.records', []),
          users: get(resources, 'users.records', []),
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
        }}
        initialValues={this.getInitialValues()}
        isLoading={this.fetchIsPending()}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default compose(
  withFileHandlers,
  stripesConnect
)(AgreementEditRoute);
