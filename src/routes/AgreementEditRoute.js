import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, difference, get } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';

import withFileHandlers from './components/withFileHandlers';
import View from '../components/views/AgreementForm';
import NoPermissions from '../components/NoPermissions';
import { urls } from '../components/utilities';

class AgreementCreateRoute extends React.Component {
  static manifest = Object.freeze({
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
      shouldRefresh: () => false,
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
      path: '/users',
      fetch: false,
      accumulate: true,
      shouldRefresh: () => false,
    },
    basket: { initialValue: [] },
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
      users: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      agreement: PropTypes.object,
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
    const contacts = get(this.props.resources, 'license.records[0].contacts', []);
    if (contacts.length) {
      this.fetchUsers(contacts);
    }
  }

  componentDidUpdate(prevProps) {
    const prevLicense = get(prevProps.resources, 'license.records[0]', {});
    const currLicense = get(this.props.resources, 'license.records[0]', {});
    const prevContacts = prevLicense.contacts || [];
    const currContacts = currLicense.contacts || [];
    const newContacts = difference(currContacts, prevContacts);
    if (prevLicense.id !== currLicense.id || newContacts.length) {
      this.fetchUsers(newContacts);
    }
  }

  fetchUsers = (contacts) => {
    if (!this.props.stripes.hasInterface('users', '15.0')) return;

    const query = contacts.map(c => `id==${c.user}`).join(' or ');

    if (!query) return;
    this.props.mutator.users.GET({ params: { query } });
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
    initialValues.orgs = orgs.map(o => ({ ...o, role: o.role.value }));

    const lines = get(resources, 'agreementLines.resources', []);
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

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(r => r && r.resource !== 'agreements')
      .some(r => r.isPending);
  }

  render() {
    const { handlers, resources } = this.props;

    if (!this.state.hasPerms) return <NoPermissions />;

    return (
      <View
        data={{
          agreementStatusValues: get(resources, 'agreementStatusValues.records', []),
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
)(AgreementCreateRoute);
