import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { cloneDeep, chunk } from 'lodash';
import compose from 'compose-function';

import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import { withAsyncValidation } from '@folio/stripes-erm-components';
import withFileHandlers from '../components/withFileHandlers';
import { joinRelatedAgreements, splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { resultCount } from '../../constants';

const { RECORDS_PER_REQUEST_MEDIUM, RECORDS_PER_REQUEST_LARGE } = resultCount;
class AgreementEditRoute extends React.Component {
  static manifest = Object.freeze({
    acquisitionMethod: {
      type: 'okapi',
      path: 'orders/acquisition-methods',
      accumulate: true,
      fetch: false,
      perRequest: 1000,
      records: 'acquisitionMethods',
    },
    agreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
      shouldRefresh: () => false,
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
      perRequest: RECORDS_PER_REQUEST_MEDIUM,
      records: 'results',
      recordsRequired: '1000',
      accumulate: 'true',
      fetch: false,
    },
    agreementStatusValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreement/agreementStatus',
      shouldRefresh: () => false,
    },
    reasonForClosureValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreement/reasonForClosure',
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST_MEDIUM,
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
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST_MEDIUM,
      shouldRefresh: () => false,
    },
    documentCategories: {
      type: 'okapi',
      path: 'erm/refdata/DocumentAttachment/atType',
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST_MEDIUM,
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
    openAccessProperties: {
      type: 'okapi',
      path: 'erm/custprops',
      params: {
        filters: 'ctx==OpenAccess',
      },
      shouldRefresh: () => false,
    },
    orderLines: {
      type: 'okapi',
      perRequest: RECORDS_PER_REQUEST_LARGE,
      path: 'orders/order-lines',
      accumulate: 'true',
      fetch: false,   // we will fetch the order lines in the componentDidMount
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
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST_MEDIUM,
      shouldRefresh: () => false,
    },
    relationshipTypeValues: {
      type: 'okapi',
      path: 'erm/refdata/AgreementRelationship/type',
      shouldRefresh: () => false,
    },
    supplementaryProperties: {
      type: 'okapi',
      path: 'erm/custprops',
      params: {
        filters: 'ctx isNull',
      },
      shouldRefresh: () => false,
    },
    users: {
      type: 'okapi',
      path: 'users',
      perRequest: RECORDS_PER_REQUEST_MEDIUM,
      params: (_q, _p, _r, _l, props) => {
        const query = (props?.resources?.agreement?.records?.[0]?.contacts ?? [])
          .filter(contact => contact.user)
          .map(contact => `id==${contact.user}`)
          .join(' or ');

        return query ? { query } : null;
      },
      fetch: props => !!props.stripes.hasInterface('users', '15.0'),
      permissionsRequired: 'users.collection.get',
      records: 'users',
    },
    basket: { initialValue: [] },
    query: { initialValue: {} },
  });

  static propTypes = {
    checkAsyncValidation: PropTypes.func,
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
      agreement: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
      agreementLines: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func,
      }),
      orderLines: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      acquisitionMethod: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      agreements: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func.isRequired
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      agreement: PropTypes.object,
      agreementLines: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      agreementStatusValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      amendmentStatusValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      basket: PropTypes.arrayOf(PropTypes.object),
      contactRoleValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      documentCategories: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      externalAgreementLine: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      isPerpetualValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      licenseLinkStatusValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      orderLines: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      acquisitionMethod: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      openAccessProperties: PropTypes.object,
      orgRoleValues: PropTypes.object,
      query: PropTypes.shape({
        addFromBasket: PropTypes.string,
      }),
      reasonForClosureValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      relationshipTypeValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      renewalPriorityValues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      statusValues: PropTypes.object,
      supplementaryProperties: PropTypes.object,
      typeValues: PropTypes.object,
      users: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
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

  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-agreements.agreements.edit'),
      initialValues: {},
      orderLines: [],
      isLoading: true,
    };
  }


  static getDerivedStateFromProps(props, state) {
    let updated = false;

    const agreement = props?.resources?.agreement?.records?.[0] ?? {};

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
      supplementaryDocs = [],
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
      initialValues.supplementaryDocs = supplementaryDocs.map(o => ({ ...o, atType: o.atType?.value }));
      initialValues.linkedLicenses = linkedLicenses.map(l => ({
        ...l,
        status: l.status.value,
        // Init the list of amendments based on the license's amendments to ensure
        // we display those that have been created since this agreement's license was last
        // edited. Ensure we provide defaults via amendmentId.
        // eslint-disable-next-line camelcase
        amendments: (l?.remoteId_object?.amendments ?? [])
          .map(a => {
            const assignedAmendment = (l.amendments || []).find(la => la.amendmentId === a.id) || {};
            return {
              ...assignedAmendment,
              amendmentId: a.id,
              status: assignedAmendment.status ? assignedAmendment.status.value : undefined,
            };
          })
      }));

      // Add the default supplementaryProperties to the already-set supplementaryProperties.
      initialValues.customProperties = initialValues.customProperties || {};
      const supplementaryProperties = (props?.resources?.supplementaryProperties?.records ?? []);
      supplementaryProperties
        .filter(t => t.primary && initialValues.customProperties[t.name] === undefined)
        // Change default to be an ignored customProperty.
        // This means any changes without setting the value will be ignored
        .forEach(t => { initialValues.customProperties[t.name] = [{ _delete: true }]; });
      // the same for open access properties
      const openAccessProperties = (props?.resources?.openAccessProperties?.records ?? []);
      openAccessProperties
        .filter(t => t.primary && initialValues.customProperties[t.name] === undefined)
        // Change default to be an ignored customProperty.
        // This means any changes without setting the value will be ignored
        .forEach(t => { initialValues.customProperties[t.name] = [{ _delete: true }]; });
      compose(
        joinRelatedAgreements,
      )(initialValues);
    }

    const lines = (props?.resources?.agreementLines?.records ?? []);
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
          activeTo: line.endDate,
          note: line.note
        };
      });
    }

    if (updated) {
      return { initialValues };
    }

    return null;
  }

  async componentDidMount() {
    const results = await this.fetchOrderLines();
    this.setState({ orderLines: results, isLoading: false });
  }

  async fetchOrderLines() {
    this.props.mutator.agreementLines.reset();
    const lines = await this.props.mutator.agreementLines.GET();
    const poLineIdsArray = (lines ?? [])
      .filter(line => line.poLines && line.poLines.length)
      .map(line => (line.poLines.map(poLine => poLine.poLineId))).flat();

    const CONCURRENT_REQUESTS = 5; // Number of requests to make concurrently
    const STEP_SIZE = 60; // Number of ids to request for per concurrent request

    const chunkedItems = chunk(poLineIdsArray, CONCURRENT_REQUESTS * STEP_SIZE); // Split into chunks of size CONCURRENT_REQUESTS * STEP_SIZE
    const data = [];
    for (const chunkedItem of chunkedItems) {  // Make requests concurrently
      this.props.mutator.orderLines.reset();
      const promisesArray = []; // Array of promises
      for (let i = 0; i < chunkedItem.length; i += STEP_SIZE) {
        promisesArray.push( // Add promises to array
          this.props.mutator.orderLines.GET({ // Make GET request
            params: {
              query: chunkedItem.slice(i, i + STEP_SIZE).map(item => `id==${item}`).join(' or '), // Make query string
              limit: 1000, // Limit to 1000
            },
          })
        );
      }
      const results = await Promise.all(promisesArray); // Wait for all requests to complete and move to the next chunk
      data.push(...results.flat()); // Add results to data
    }

    return data;
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

  /* istanbul ignore next */
  handleSubmit = (agreement) => {
    const { history, location, mutator, resources } = this.props;
    const relationshipTypeValues = resources?.relationshipTypeValues?.records ?? [];
    const name = agreement?.name;

    compose(
      splitRelatedAgreements,
    )(agreement, relationshipTypeValues);

    return mutator.agreement
      .PUT(agreement)
      .then(({ id }) => {
        this.context.sendCallout({ message: <FormattedMessage id="ui-agreements.agreements.update.callout" values={{ name }} /> });
        history.push(`${urls.agreementView(id)}${location.search}`);
      });
  }

  getAgreementLines = () => {
    return [
      ...(this.props.resources?.agreementLines?.records ?? []),
      ...this.getAgreementLinesToAdd(),
    ];
  }

  getAgreementLinesToAdd = () => {
    const { resources } = this.props;
    const { query: { addFromBasket } } = resources;

    const externalAgreementLines = resources?.externalAgreementLine?.records ?? [];

    let basketLines = [];
    if (resources.query.addFromBasket) {
      const basket = resources?.basket ?? [];

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
      .filter(r => r && (r.resource !== 'agreements' || r.resource !== 'orderLines'))
      .some(r => r.isPending);
  }

  render() {
    const { handlers, resources } = this.props;

    if (!this.state.hasPerms) return <NoPermissions />;
    if (this.fetchIsPending() || this.state.isLoading) return <LoadingView dismissible onClose={this.handleClose} />;

    return (
      <View
        data={{
          agreementLines: this.getAgreementLines(),
          agreementLinesToAdd: this.getAgreementLinesToAdd(),
          agreementStatusValues: resources?.agreementStatusValues?.records ?? [],
          reasonForClosureValues: resources?.reasonForClosureValues?.records ?? [],
          amendmentStatusValues: resources?.amendmentStatusValues?.records ?? [],
          basket: resources?.basket ?? [],
          contactRoleValues: resources?.contactRoleValues?.records ?? [],
          documentCategories: resources?.documentCategories?.records ?? [],
          externalAgreementLine: resources?.externalAgreementLine?.records ?? [],
          isPerpetualValues: resources?.isPerpetualValues?.records ?? [],
          licenseLinkStatusValues: resources?.licenseLinkStatusValues?.records ?? [],
          openAccessProperties: resources?.openAccessProperties?.records ?? [],
          orderLines: this.state.orderLines,
          acquisitionMethod: resources?.acquisitionMethod?.records ?? [],
          orgRoleValues: resources?.orgRoleValues?.records ?? [],
          renewalPriorityValues: resources?.renewalPriorityValues?.records ?? [],
          supplementaryProperties: resources?.supplementaryProperties?.records ?? [],
          users: resources?.users?.records ?? [],
        }}
        handlers={{
          ...handlers,
          onBasketLinesAdded: this.handleBasketLinesAdded,
          onAsyncValidate: this.props.checkAsyncValidation,
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
  withAsyncValidation,
  stripesConnect
)(AgreementEditRoute);
