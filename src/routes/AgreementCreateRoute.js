import React from 'react';
import PropTypes from 'prop-types';
import compose from 'compose-function';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes-erm-components';

import withFileHandlers from './components/withFileHandlers';
import { splitRelatedAgreements } from './utilities/processRelatedAgreements';
import View from '../components/views/AgreementForm';
import NoPermissions from '../components/NoPermissions';
import { urls } from '../components/utilities';

class AgreementCreateRoute extends React.Component {
  static manifest = Object.freeze({
    agreements: {
      type: 'okapi',
      path: 'erm/sas',
      fetch: false,
      shouldRefresh: () => false,
    },
    supplementaryProperties: {
      type: 'okapi',
      path: 'erm/custprops',
      shouldRefresh: () => false,
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
      path: 'erm/refdata/SubscriptionAgreement/isPerpetual',
      shouldRefresh: () => false,
    },
    licenseLinkStatusValues: {
      type: 'okapi',
      path: 'erm/refdata/RemoteLicenseLink/status',
      shouldRefresh: () => false,
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
    mutator: PropTypes.shape({
      agreements: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
      query: PropTypes.shape({
        update: PropTypes.func.isRequired
      }).isRequired,
    }),
    resources: PropTypes.shape({
      agreement: PropTypes.object,
      orgRoleValues: PropTypes.object,
      statusValues: PropTypes.object,
      supplementaryProperties: PropTypes.object,
      typeValues: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
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

  handleBasketLinesAdded = () => {
    this.props.mutator.query.update({
      addFromBasket: null,
      authority: null,
      referenceId: null,
    });
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.agreements()}${location.search}`);
  }

  handleSubmit = (agreement) => {
    const { history, location, mutator } = this.props;

    compose(
      splitRelatedAgreements,
    )(agreement);

    mutator.agreements
      .POST(agreement)
      .then(({ id }) => {
        history.push(`${urls.agreementView(id)}${location.search}`);
      });
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
        .filter(line => line.resource); // check that there _was_ a basket item at that index
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

  getInitialValues = () => {
    const customProperties = {};
    (this.props.resources?.supplementaryProperties?.records || [])
      .filter(term => term.primary)
      .forEach(term => { customProperties[term.name] = ''; });
    const periods = [{}];

    return {
      periods,
      customProperties,
    };
  }

  render() {
    const { handlers, resources } = this.props;

    if (!this.state.hasPerms) return <NoPermissions />;
    if (this.fetchIsPending()) return <LoadingPane onClose={this.handleClose} renderPaneset />;

    return (
      <View
        data={{
          agreementLines: this.getAgreementLinesToAdd(),
          agreementLinesToAdd: this.getAgreementLinesToAdd(),
          agreementStatusValues: (resources?.agreementStatusValues?.records ?? []),
          reasonForClosureValues: (resources?.reasonForClosureValues?.records ?? []),
          amendmentStatusValues: (resources?.amendmentStatusValues?.records ?? []),
          basket: (resources?.basket ?? []),
          supplementaryProperties: (resources?.supplementaryProperties?.records ?? []),
          contactRoleValues: (resources?.contactRoleValues?.records ?? []),
          isPerpetualValues: (resources?.isPerpetualValues?.records ?? []),
          licenseLinkStatusValues: (resources?.licenseLinkStatusValues?.records ?? []),
          orgRoleValues: (resources?.orgRoleValues?.records ?? []),
          renewalPriorityValues: (resources?.renewalPriorityValues?.records ?? []),
          users: [],
        }}
        handlers={{
          ...handlers,
          onBasketLinesAdded: this.handleBasketLinesAdded,
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
