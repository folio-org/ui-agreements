import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, get } from 'lodash';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes-erm-components';

import withFileHandlers from './components/withFileHandlers';
import { joinRelatedAgreements, splitRelatedAgreements } from './utilities/processRelatedAgreements';
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
        stats: 'true',
        term: ':{id}',
      },
      limitParam: 'perPage',
      perRequest: 100,
      records: 'results',
      recordsRequired: '1000',
    },
    agreementStatusValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreement/agreementStatus',
      shouldRefresh: () => false,
    },
    reasonForClosureValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreement/reasonForClosure',
      shouldRefresh: () => false,
    },
    amendmentStatusValues: {
      type: 'okapi',
      path: 'erm/refdata/LicenseAmendmentStatus/status',
      shouldRefresh: () => false,
    },
    contactRoleValues: {
      type: 'okapi',
      path: 'erm/refdata/InternalContact/role',
      shouldRefresh: () => false,
    },
    isPerpetualValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreement/isPerpetual',
      shouldRefresh: () => false,
    },
    licenseLinkStatusValues: {
      type: 'okapi',
      path: 'erm/refdata/RemoteLicenseLink/status',
      shouldRefresh: () => false,
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

        return query ? { query } : {};
      },
      fetch: props => !!props.stripes.hasInterface('orders', '6.0 7.0 8.0'),
      records: 'poLines',
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreementOrg/role',
      shouldRefresh: () => false,
    },
    renewalPriorityValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreement/renewalPriority',
      shouldRefresh: () => false,
    },
    users: {
      type: 'okapi',
      path: 'users',
      params: (_q, _p, _r, _l, props) => {
        const query = get(props.resources, 'agreement.records[0].contacts', [])
          .filter(contact => contact.user)
          .map(contact => `id==${contact.user}`)
          .join(' or ');

        return query ? { query } : {};
      },
      fetch: props => !!props.stripes.hasInterface('users', '15.0'),
      records: 'users',
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
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired
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
      initialValues: {},
    };
  }

  static getDerivedStateFromProps(props, state) {
    let updated = false;

    const agreement = get(props.resources, 'agreement.records[0]', {});

    // Start with the existing initialValues. However, if we've just fetched a new agreement
    // then use that as the baseline. This would be the case if we didn't have an agreement in
    // resources at first, but also if we pulled stale agreement data from `resources` when this
    // component was inited. Eg, when viewing one agreement and then entering the Edit screen
    // for another agreement without viewing it first. This would occur when adding to an agreement
    // via the Basket.
    let initialValues = state.initialValues;
    if (agreement.id === props.match.params.id && !initialValues.id) {
      initialValues = cloneDeep(agreement);
    }

    const {
      agreementStatus = {},
      contacts = [],
      isPerpetual = {},
      items = [],
      linkedLicenses = [],
      orgs = [],
      reasonForClosure = {},
      renewalPriority = {},
    } = initialValues;

    if (initialValues.id !== state.initialValues.id) {
      updated = true;

      // Set the values of dropdown-controlled props as values rather than objects.
      initialValues.agreementStatus = agreementStatus.value;
      initialValues.isPerpetual = isPerpetual.value;
      initialValues.reasonForClosure = reasonForClosure.value;
      initialValues.renewalPriority = renewalPriority.value;
      initialValues.contacts = contacts.map(c => ({ ...c, role: c.role.value }));
      initialValues.orgs = orgs.map(o => ({ ...o, role: o.role && o.role.value }));
      initialValues.linkedLicenses = linkedLicenses.map(l => ({
        ...l,
        status: l.status.value,
        // Init the list of amendments based on the license's amendments to ensure
        // we display those that have been created since this agreement's license was last
        // edited. Ensure we provide defaults via amendmentId.
        amendments: get(l, 'remoteId_object.amendments', [])
          .map(a => {
            const assignedAmendment = (l.amendments || []).find(la => la.amendmentId === a.id) || {};
            return {
              ...assignedAmendment,
              amendmentId: a.id,
              status: assignedAmendment.status ? assignedAmendment.status.value : undefined,
            };
          })
      }));

      compose(
        joinRelatedAgreements,
      )(initialValues);
    }

    const lines = get(props.resources, 'agreementLines.records', []);
    if (items.length && lines.length && (lines[0].owner.id === props.match.params.id)) {
      updated = true;

      initialValues.items = items.map(item => {
        if (item.resource) return item;

        const line = lines.find(l => l.id === item.id);
        if (!line) return item;

        return {
          id: line.id,
          coverage: line.customCoverage ? line.coverage : undefined,
          poLines: line.poLines,
          activeFrom: line.startDate,
          activeTo: line.endDate
        };
      });
    }

    if (updated) {
      return { initialValues };
    }

    return null;
  }

  handleBasketLinesAdded = () => {
    this.props.mutator.query.update({
      addFromBasket: null,
      authority: null,
      referenceId: null,
    });
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.agreementView(match.params.id)}${location.search}`);
  }

  handleSubmit = (agreement) => {
    const { history, location, mutator } = this.props;

    compose(
      splitRelatedAgreements,
    )(agreement);

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

  render() {
    const { handlers, resources } = this.props;

    if (!this.state.hasPerms) return <NoPermissions />;
    if (this.fetchIsPending()) return <LoadingPane onClose={this.handleClose} renderPaneset />;

    return (
      <View
        data={{
          agreementLines: this.getAgreementLines(),
          agreementLinesToAdd: this.getAgreementLinesToAdd(),
          agreementStatusValues: get(resources, 'agreementStatusValues.records', []),
          reasonForClosureValues: get(resources, 'reasonForClosureValues.records', []),
          amendmentStatusValues: get(resources, 'amendmentStatusValues.records', []),
          basket: get(resources, 'basket', []),
          contactRoleValues: get(resources, 'contactRoleValues.records', []),
          externalAgreementLine: get(resources, 'externalAgreementLine.records', []),
          isPerpetualValues: get(resources, 'isPerpetualValues.records', []),
          licenseLinkStatusValues: get(resources, 'licenseLinkStatusValues.records', []),
          orderLines: get(resources, 'orderLines.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          renewalPriorityValues: get(resources, 'renewalPriorityValues.records', []),
          users: get(resources, 'users.records', []),
        }}
        handlers={{
          ...handlers,
          onBasketLinesAdded: this.handleBasketLinesAdded,
          onClose: this.handleClose,
        }}
        initialValues={this.state.initialValues}
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
