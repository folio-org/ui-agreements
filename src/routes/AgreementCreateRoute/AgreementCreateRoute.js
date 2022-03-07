import React from 'react';
import PropTypes from 'prop-types';
import compose from 'compose-function';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { LoadingView } from '@folio/stripes/components';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import { withAsyncValidation } from '@folio/stripes-erm-components';
import withFileHandlers from '../components/withFileHandlers';
import { splitRelatedAgreements } from '../utilities/processRelatedAgreements';
import View from '../../components/views/AgreementForm';
import NoPermissions from '../../components/NoPermissions';
import { urls } from '../../components/utilities';
import { resultCount } from '../../constants';

const { RECORDS_PER_REQUEST_MEDIUM } = resultCount;

class AgreementCreateRoute extends React.Component {
  static manifest = Object.freeze({
    agreements: {
      type: 'okapi',
      path: 'erm/sas',
      fetch: false,
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
    openAccessProperties: {
      type: 'okapi',
      path: 'erm/custprops',
      params: {
        filters: 'ctx==OpenAccess',
      },
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreementOrg/role',
      shouldRefresh: () => false,
    },
    relationshipTypeValues: {
      type: 'okapi',
      path: 'erm/refdata/AgreementRelationship/type',
      shouldRefresh: () => false,
    },
    renewalPriorityValues: {
      type: 'okapi',
      path: 'erm/refdata/SubscriptionAgreement/renewalPriority',
      limitParam: 'perPage',
      perRequest: RECORDS_PER_REQUEST_MEDIUM,
      shouldRefresh: () => false,
    },
    supplementaryProperties: {
      type: 'okapi',
      params: {
        filters: 'ctx isNull',
      },
      path: 'erm/custprops',
      shouldRefresh: () => false,
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
    }).isRequired,
    stripes: PropTypes.shape({
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

  /* istanbul ignore next */
  handleSubmit = (agreement) => {
    const { history, location, mutator, resources } = this.props;
    const relationshipTypeValues = resources?.relationshipTypeValues?.records ?? [];

    const name = agreement?.name;
    compose(
      splitRelatedAgreements,
    )(agreement, relationshipTypeValues);

    return mutator.agreements
      .POST(agreement)
      .then(({ id }) => {
        this.context.sendCallout({ message: <SafeHTMLMessage id="ui-agreements.agreements.create.callout" values={{ name }} /> });
        history.push(`${urls.agreementView(id)}${location.search}`);
      });
  }

  getAgreementLinesToAdd = () => {
    const { resources } = this.props;
    const { query = {} } = resources;

    const externalAgreementLines = resources?.externalAgreementLine?.records ?? [];

    let basketLines = [];
    if (query.addFromBasket) {
      const basket = resources?.basket ?? [];

      basketLines = query.addFromBasket
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
      // Change default to be an ignored customProperty.
      // This means any changes without setting the value will be ignored
      .forEach(term => { customProperties[term.name] = [{ _delete: true }]; });
    // same for openAccessProperties
    (this.props.resources?.openAccessProperties?.records || [])
      .filter(term => term.primary)
      // Change default to be an ignored customProperty.
      // This means any changes without setting the value will be ignored
      .forEach(term => { customProperties[term.name] = [{ _delete: true }]; });
    const periods = [{}];

    return {
      periods,
      customProperties,
    };
  }

  render() {
    const { handlers, resources } = this.props;

    if (!this.state.hasPerms) return <NoPermissions />;
    if (this.fetchIsPending()) return <LoadingView dismissible onClose={this.handleClose} />;

    return (
      <View
        data={{
          agreementLines: this.getAgreementLinesToAdd(),
          agreementLinesToAdd: this.getAgreementLinesToAdd(),
          agreementStatusValues: (resources?.agreementStatusValues?.records ?? []),
          reasonForClosureValues: (resources?.reasonForClosureValues?.records ?? []),
          amendmentStatusValues: (resources?.amendmentStatusValues?.records ?? []),
          basket: (resources?.basket ?? []),
          openAccessProperties: (resources?.openAccessProperties?.records ?? []),
          supplementaryProperties: (resources?.supplementaryProperties?.records ?? []),
          contactRoleValues: (resources?.contactRoleValues?.records ?? []),
          documentCategories: (resources?.documentCategories?.records ?? []),
          isPerpetualValues: (resources?.isPerpetualValues?.records ?? []),
          licenseLinkStatusValues: (resources?.licenseLinkStatusValues?.records ?? []),
          orgRoleValues: (resources?.orgRoleValues?.records ?? []),
          renewalPriorityValues: (resources?.renewalPriorityValues?.records ?? []),
          users: [],
        }}
        handlers={{
          ...handlers,
          onBasketLinesAdded: this.handleBasketLinesAdded,
          onAsyncValidate: this.props.checkAsyncValidation,
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
  withAsyncValidation,
  stripesConnect
)(AgreementCreateRoute);
